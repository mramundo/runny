import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { Faq } from './components/Faq'
import { Footer } from './components/Footer'
import { Header } from './components/Header'
import { Hero } from './components/Hero'
import { Lanes } from './components/Lanes'
import { LoadingRunner } from './components/LoadingRunner'
import { Planner } from './components/Planner'
import { RouteCard } from './components/RouteCard'
import { Suggestions } from './components/Suggestions'
import { WindowsSection } from './components/WindowsSection'
import { DEFAULT_PACE } from './lib/distances'
import {
  currentPosition,
  detectCountryLang,
  guessLang,
  reverseGeocode,
  storeLang,
  storedLang,
  type GeoFailure,
} from './lib/geo'
import { t } from './lib/i18n'
import { buildSuggestions, routeBetween, withElevation } from './lib/route'
import { bestPerDay, findWindows, topWindows, windowHours } from './lib/score'
import { forecastAlongRoute } from './lib/weather'
import type { AppError, Forecast, Lang, Place, RoutePlan, Suggestion } from './lib/types'

const DAY_START = 5
const DAY_END = 22
const DEFAULT_LOOP_KM = 10
const STATE_KEY = 'runny:last'

type View = 'planner' | 'faq'

type Saved = {
  start: Place | null
  end: Place | null
  loop: boolean
  pace: number
}

function loadSaved(): Saved | null {
  try {
    const raw = localStorage.getItem(STATE_KEY)
    if (!raw) return null
    const parsed = JSON.parse(raw) as Partial<Saved>
    if (typeof parsed.pace !== 'number') return null
    return {
      start: parsed.start ?? null,
      end: parsed.end ?? null,
      loop: Boolean(parsed.loop),
      pace: parsed.pace,
    }
  } catch {
    return null
  }
}

export default function App() {
  const saved = useMemo(loadSaved, [])

  const [lang, setLang] = useState<Lang>(guessLang)
  const [view, setView] = useState<View>(() =>
    location.hash.replace('#', '') === 'faq' ? 'faq' : 'planner',
  )

  const [start, setStart] = useState<Place | null>(saved?.start ?? null)
  const [end, setEnd] = useState<Place | null>(saved?.end ?? null)
  const [loop, setLoop] = useState(saved?.loop ?? true)
  const [pace, setPace] = useState(saved?.pace ?? DEFAULT_PACE)

  const [plan, setPlan] = useState<RoutePlan | null>(null)
  const [activeSuggestion, setActiveSuggestion] = useState<string | null>(null)
  const [forecast, setForecast] = useState<Forecast | null>(null)

  const [selectedKm, setSelectedKm] = useState<number | null>(null)
  const [suggestions, setSuggestions] = useState<Suggestion[]>([])
  const [suggestBusy, setSuggestBusy] = useState(false)
  const [suggestFailed, setSuggestFailed] = useState(false)

  const [includeNight, setIncludeNight] = useState(false)
  const [gpsBusy, setGpsBusy] = useState(false)
  const [working, setWorking] = useState(false)
  const [error, setError] = useState<AppError | null>(null)
  const [now, setNow] = useState(() => Date.now())

  const strings = t(lang)
  const resultsRef = useRef<HTMLDivElement>(null)
  const plannerRef = useRef<HTMLDivElement>(null)
  const jobs = useRef<AbortController | null>(null)

  /* ---------- language ---------- */

  useEffect(() => {
    document.documentElement.lang = lang
    document.title = lang === 'it' ? 'Runny — trova la tua ora' : 'Runny — find your hour'
  }, [lang])

  useEffect(() => {
    // Italian inside Italy, English everywhere else — unless the visitor has
    // already said otherwise, in which case their choice is never overridden.
    if (storedLang() || new URLSearchParams(location.search).get('lang')) return
    const ctrl = new AbortController()
    detectCountryLang(ctrl.signal).then((detected) => {
      if (detected && !ctrl.signal.aborted) setLang(detected)
    })
    return () => ctrl.abort()
  }, [])

  const chooseLang = useCallback((next: Lang) => {
    setLang(next)
    storeLang(next)
  }, [])

  /* ---------- view ---------- */

  useEffect(() => {
    const onHash = () => setView(location.hash.replace('#', '') === 'faq' ? 'faq' : 'planner')
    addEventListener('hashchange', onHash)
    return () => removeEventListener('hashchange', onHash)
  }, [])

  const goView = useCallback((next: View) => {
    setView(next)
    history.replaceState(null, '', next === 'faq' ? '#faq' : ' ')
    scrollTo({ top: 0, behavior: 'smooth' })
  }, [])

  /* ---------- persistence + clock ---------- */

  useEffect(() => {
    try {
      localStorage.setItem(STATE_KEY, JSON.stringify({ start, end, loop, pace } satisfies Saved))
    } catch {
      /* private mode */
    }
  }, [start, end, loop, pace])

  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 60_000)
    return () => clearInterval(id)
  }, [])

  useEffect(() => () => jobs.current?.abort(), [])

  /* ---------- actions ---------- */

  const resetPlan = useCallback(() => {
    setPlan(null)
    setForecast(null)
    setActiveSuggestion(null)
  }, [])

  const changeStart = useCallback(
    (place: Place | null) => {
      setStart(place)
      setSuggestions([])
      setSelectedKm(null)
      resetPlan()
    },
    [resetPlan],
  )

  const changeEnd = useCallback(
    (place: Place | null) => {
      setEnd(place)
      resetPlan()
    },
    [resetPlan],
  )

  const useGps = useCallback(async () => {
    setGpsBusy(true)
    setError(null)
    try {
      const at = await currentPosition()
      const place = await reverseGeocode(at, lang, strings.planner.yourLocation)
      changeStart(place)
    } catch (err) {
      const kind = err as GeoFailure
      setError({
        kind: 'geo',
        message:
          kind === 'unsupported'
            ? strings.errors.geoUnsupported
            : kind === 'denied'
              ? strings.errors.geoDenied
              : strings.errors.geoFailed,
      })
    } finally {
      setGpsBusy(false)
    }
  }, [changeStart, lang, strings])

  /** Route + elevation + forecast, as one job that can be cancelled wholesale. */
  const loadForecast = useCallback(
    async (basePlan: RoutePlan, suggestionId: string | null) => {
      jobs.current?.abort()
      const ctrl = new AbortController()
      jobs.current = ctrl

      setWorking(true)
      setError(null)
      try {
        const withGain = await withElevation(basePlan, ctrl.signal)
        if (ctrl.signal.aborted) return
        setPlan(withGain)
        setActiveSuggestion(suggestionId)

        const data = await forecastAlongRoute(withGain.points, ctrl.signal)
        if (ctrl.signal.aborted) return
        setForecast(data)
        setNow(Date.now())
        requestAnimationFrame(() =>
          resultsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }),
        )
      } catch (err) {
        if (ctrl.signal.aborted) return
        setForecast(null)
        setError({ kind: 'weather', message: `${strings.errors.weather} (${String(err)})` })
      } finally {
        if (!ctrl.signal.aborted) setWorking(false)
      }
    },
    [strings],
  )

  const submit = useCallback(async () => {
    if (!start) return
    setError(null)

    // A route already chosen from the suggestions only needs its forecast.
    if (plan) {
      await loadForecast(plan, activeSuggestion)
      return
    }

    setWorking(true)
    try {
      if (loop) {
        const built = await buildSuggestions(start, selectedKm ?? DEFAULT_LOOP_KM, true)
        if (built.length === 0) {
          setError({ kind: 'route', message: strings.suggest.failed })
          return
        }
        setSuggestions(built)
        setSelectedKm(selectedKm ?? DEFAULT_LOOP_KM)
        await loadForecast(built[0], built[0].id)
        return
      }

      if (!end) return
      if (Math.abs(end.lat - start.lat) < 1e-5 && Math.abs(end.lon - start.lon) < 1e-5) {
        setError({ kind: 'route', message: strings.errors.routeSame })
        return
      }
      const routed = await routeBetween(start, end)
      await loadForecast(routed, null)
    } catch (err) {
      setError({ kind: 'route', message: `${strings.errors.route} (${String(err)})` })
    } finally {
      setWorking(false)
    }
  }, [activeSuggestion, end, loadForecast, loop, plan, selectedKm, start, strings])

  const pickDistance = useCallback(
    async (targetKm: number) => {
      if (!start) return
      setSelectedKm(targetKm)
      setSuggestions([])
      setSuggestFailed(false)
      setSuggestBusy(true)
      setError(null)
      try {
        const built = await buildSuggestions(start, targetKm, loop)
        setSuggestions(built)
        setSuggestFailed(built.length === 0)
      } catch {
        setSuggestFailed(true)
      } finally {
        setSuggestBusy(false)
      }
    },
    [loop, start],
  )

  const pickSuggestion = useCallback(
    (s: Suggestion) => {
      if (!loop) setEnd(s.end)
      void loadForecast(s, s.id)
    },
    [loadForecast, loop],
  )

  /* ---------- derived ---------- */

  const hoursNeeded = plan ? windowHours(plan.meters / 1000, pace) : 1

  const windows = useMemo(() => {
    if (!forecast) return []
    return findWindows(forecast.hours, {
      hours: hoursNeeded,
      dayStart: DAY_START,
      dayEnd: DAY_END,
      includeNight,
      now,
    })
  }, [forecast, hoursNeeded, includeNight, now])

  const best = useMemo(() => topWindows(windows, 3), [windows])

  // Days already represented above would just be the same card twice.
  const perDay = useMemo(() => {
    const shown = new Set(best.map((w) => w.startIso))
    return bestPerDay(windows).filter((w) => !shown.has(w.startIso))
  }, [best, windows])

  /** "Now" in the route's own calendar, so Today/Tomorrow never drift. */
  const todayIso = useMemo(() => {
    if (!forecast || forecast.hours.length === 0) return new Date().toISOString().slice(0, 16)
    const current = forecast.hours.find((h) => h.t + 3_600_000 > now)
    return (current ?? forecast.hours[0]).time
  }, [forecast, now])

  const ghosts = useMemo(
    () => suggestions.filter((s) => s.id !== activeSuggestion).map((s) => s.points),
    [activeSuggestion, suggestions],
  )

  return (
    <>
      <Lanes />
      <div className="mx-auto w-full max-w-5xl px-5 sm:px-8">
        <Header strings={strings} lang={lang} onLang={chooseLang} view={view} onView={goView} />
      </div>

      <main className="mx-auto w-full max-w-5xl px-5 sm:px-8">
        {view === 'faq' ? (
          <Faq strings={strings} onBack={() => goView('planner')} />
        ) : (
          <>
            <Hero
              strings={strings}
              onStart={() => plannerRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })}
              onFaq={() => goView('faq')}
            />

            {error && (
              <div
                role="alert"
                className="mb-5 flex flex-wrap items-start justify-between gap-3 border-l-2 border-flare bg-pit px-4 py-3"
              >
                <p className="clip text-sm font-semibold">{error.message}</p>
                <button
                  type="button"
                  aria-label={strings.errors.retry}
                  className="shrink-0 font-mono text-sm text-faint transition-colors hover:text-flare"
                  onClick={() => setError(null)}
                >
                  ✕
                </button>
              </div>
            )}

            <div ref={plannerRef} className="space-y-4 scroll-mt-6">
              <Planner
                strings={strings}
                lang={lang}
                start={start}
                end={end}
                onStart={changeStart}
                onEnd={changeEnd}
                loop={loop}
                onLoop={(v) => {
                  setLoop(v)
                  setSuggestions([])
                  resetPlan()
                }}
                pace={pace}
                onPace={setPace}
                onGps={useGps}
                gpsBusy={gpsBusy}
                onSubmit={submit}
                submitting={working}
                onSearchError={() => setError({ kind: 'search', message: strings.errors.search })}
              />

              <Suggestions
                strings={strings}
                lang={lang}
                hasStart={Boolean(start)}
                pace={pace}
                selectedKm={selectedKm}
                onSelectKm={pickDistance}
                suggestions={suggestions}
                busy={suggestBusy}
                failed={suggestFailed}
                activeId={activeSuggestion}
                onPick={pickSuggestion}
              />
            </div>

            <div ref={resultsRef} className="mt-4 space-y-4 scroll-mt-6">
              {working && !forecast && <LoadingRunner message={strings.planner.submitting} />}

              {plan && (
                <RouteCard
                  strings={strings}
                  lang={lang}
                  plan={plan}
                  ghosts={ghosts}
                  pace={pace}
                  sampleCount={forecast?.sampleCount ?? null}
                />
              )}

              {forecast && (
                <WindowsSection
                  strings={strings}
                  lang={lang}
                  forecast={forecast}
                  best={best}
                  perDay={perDay}
                  includeNight={includeNight}
                  onIncludeNight={setIncludeNight}
                  windowSeconds={hoursNeeded * 3600}
                  todayIso={todayIso}
                  now={now}
                />
              )}
            </div>
          </>
        )}

        <Footer strings={strings} onView={goView} />
      </main>
    </>
  )
}
