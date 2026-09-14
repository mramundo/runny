import { BAND_HEX, BAND_ORDER } from '../lib/bands'
import { duration } from '../lib/format'
import type { Forecast, Lang, RunWindow } from '../lib/types'
import type { Strings } from '../lib/i18n'
import { HourRail } from './HourRail'
import { SectionHead } from './SectionHead'
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
  // `best` arrives ranked, so the first is the pick; the rest read better in
  // clock order underneath it.
  const [featured, ...others] = best
  const rest = [...others].sort((a, b) => a.startT - b.startT)

  return (
    <section id="windows" className="panel tick">
      <SectionHead kicker={strings.windows.kicker} title={strings.windows.title} />

      <p className="clip mt-4 max-w-2xl text-[0.95rem] leading-relaxed text-muted">
        {strings.windows.lead}
      </p>

      {/* The two settings that shape everything below sit on one rule together,
          rather than floating beside the heading. */}
      <div className="hairline mt-5 flex flex-wrap items-center justify-between gap-x-8 gap-y-4 pt-4">
        <p className="flex items-baseline gap-2 whitespace-nowrap">
          <span className="label">{strings.windows.windowLength}</span>
          <span className="num text-base">{duration(windowSeconds, lang)}</span>
        </p>

        <label className="flex cursor-pointer items-center gap-3">
          <input
            type="checkbox"
            className="sr-only"
            checked={includeNight}
            onChange={(e) => onIncludeNight(e.target.checked)}
          />
          <span className="switch" data-on={includeNight} aria-hidden="true" />
          <span className="min-w-0">
            <span className="label block">{strings.windows.nightToggle}</span>
            <span className="clip mt-0.5 block font-mono text-[0.62rem] text-faint">
              {strings.windows.nightHint}
            </span>
          </span>
        </label>
      </div>

      {!featured && <p className="mt-8 text-lg font-semibold">{strings.windows.none}</p>}

      {featured && (
        <div className="mt-7">
          <p className="label mb-3">{strings.windows.best}</p>
          <WindowCard window={featured} strings={strings} lang={lang} todayIso={todayIso} featured />
        </div>
      )}

      {rest.length > 0 && (
        <div className="mt-7">
          <p className="label mb-3">{strings.windows.alternatives}</p>
          <div className="grid gap-3 lg:grid-cols-2">
            {rest.map((w) => (
              <WindowCard key={w.startIso} window={w} strings={strings} lang={lang} todayIso={todayIso} />
            ))}
          </div>
        </div>
      )}

      {perDay.length > 0 && (
        <div className="mt-7">
          <p className="label mb-3">{strings.windows.perDay}</p>
          <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
            {perDay.map((w) => (
              <WindowCard key={`day-${w.startIso}`} window={w} strings={strings} lang={lang} todayIso={todayIso} />
            ))}
          </div>
        </div>
      )}

      <div className="hairline mt-8 pt-6">
        <div className="flex flex-wrap items-center justify-between gap-x-6 gap-y-3">
          <p className="label">{strings.windows.hourly}</p>
          <ul className="flex flex-wrap gap-x-4 gap-y-1" aria-label={strings.windows.legend}>
            {BAND_ORDER.map((b) => (
              <li key={b} className="label flex items-center gap-1.5">
                <span
                  className="inline-block h-2 w-2 rounded-[1px]"
                  style={{ background: BAND_HEX[b] }}
                  aria-hidden="true"
                />
                {strings.bands[b]}
              </li>
            ))}
          </ul>
        </div>
        <div className="mt-5">
          <HourRail hours={forecast.hours} strings={strings} lang={lang} todayIso={todayIso} now={now} />
        </div>
      </div>
    </section>
  )
}
