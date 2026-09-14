import { BAND_BG, BAND_ORDER } from '../lib/bands'
import { duration } from '../lib/format'
import type { Forecast, Lang, RunWindow } from '../lib/types'
import type { Strings } from '../lib/i18n'
import { HourRail } from './HourRail'
import { WindowCard } from './WindowCard'

type Props = {
  strings: Strings
  lang: Lang
  forecast: Forecast
  best: RunWindow[]
  perDay: RunWindow[]
  includeNight: boolean
  onIncludeNight: (v: boolean) => void
  windowSeconds: number
  todayIso: string
  now: number
}

export function WindowsSection({
  strings,
  lang,
  forecast,
  best,
  perDay,
  includeNight,
  onIncludeNight,
  windowSeconds,
  todayIso,
  now,
}: Props) {
  // `best` arrives ranked, so the first is the top pick; the rest read better
  // in clock order underneath it.
  const [featured, ...others] = best
  const rest = [...others].sort((a, b) => a.startT - b.startT)

  return (
    <section id="windows" className="space-y-5">
      <div className="card p-5 sm:p-7">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <span className="sticker bg-band-perfect px-3 py-1 text-[0.62rem]">{strings.windows.kicker}</span>
            <h2 className="font-display mt-3 text-2xl leading-none font-black sm:text-3xl">
              {strings.windows.title}
            </h2>
            <p className="mt-3 max-w-xl text-sm font-semibold text-ink-soft">
              {strings.windows.lead} · {duration(windowSeconds, lang)}
            </p>
          </div>

          <label className="flex cursor-pointer items-center gap-3 rounded-full border-[3px] border-ink bg-white px-4 py-2.5 shadow-pop-xs">
            <input
              type="checkbox"
              className="sr-only"
              checked={includeNight}
              onChange={(e) => onIncludeNight(e.target.checked)}
            />
            <span
              className={`relative h-5 w-9 rounded-full border-[2.5px] border-ink transition ${
                includeNight ? 'bg-grape' : 'bg-paper-dim'
              }`}
            >
              <span
                className={`absolute top-[1px] h-[13px] w-[13px] rounded-full border-2 border-ink bg-white transition-all ${
                  includeNight ? 'left-[17px]' : 'left-[1px]'
                }`}
              />
            </span>
            <span className="text-left text-sm font-extrabold">
              {strings.windows.nightToggle}
              <span className="block text-[0.62rem] font-semibold text-ink-soft">
                {strings.windows.nightHint}
              </span>
            </span>
          </label>
        </div>

        {!featured && <p className="mt-6 font-display text-lg font-extrabold">{strings.windows.none}</p>}

        {featured && (
          <div className="mt-6">
            <p className="font-display mb-3 text-xs font-black tracking-[0.16em] uppercase text-ink-soft">
              {strings.windows.best}
            </p>
            <WindowCard window={featured} strings={strings} lang={lang} todayIso={todayIso} featured />
          </div>
        )}

        {rest.length > 0 && (
          <div className="mt-6">
            <p className="font-display mb-3 text-xs font-black tracking-[0.16em] uppercase text-ink-soft">
              {strings.windows.alternatives}
            </p>
            <div className="grid gap-4 lg:grid-cols-2">
              {rest.map((w) => (
                <WindowCard key={w.startIso} window={w} strings={strings} lang={lang} todayIso={todayIso} />
              ))}
            </div>
          </div>
        )}
      </div>

      {perDay.length > 0 && (
        <div className="card p-5 sm:p-7">
          <h3 className="font-display text-xl font-black sm:text-2xl">{strings.windows.perDay}</h3>
          <div className="mt-4 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {perDay.map((w) => (
              <WindowCard key={`day-${w.startIso}`} window={w} strings={strings} lang={lang} todayIso={todayIso} />
            ))}
          </div>
        </div>
      )}

      <div className="card p-5 sm:p-7">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h3 className="font-display text-xl font-black sm:text-2xl">{strings.windows.hourly}</h3>
          <ul className="flex flex-wrap gap-2" aria-label={strings.windows.legend}>
            {BAND_ORDER.map((b) => (
              <li key={b} className={`chip ${BAND_BG[b]} px-2.5 py-1 text-[0.62rem]`}>
                {strings.bands[b]}
              </li>
            ))}
          </ul>
        </div>
        <div className="mt-4">
          <HourRail hours={forecast.hours} strings={strings} lang={lang} todayIso={todayIso} now={now} />
        </div>
      </div>
    </section>
  )
}
