import { BAND_BG } from '../lib/bands'
import { clock, dayLabel } from '../lib/format'
import { bandOf } from '../lib/score'
import type { Lang, RunWindow } from '../lib/types'
import type { Strings } from '../lib/i18n'
import { ScoreDial } from './ScoreDial'
import { WeatherGlyph } from './WeatherGlyph'

type Props = {
  window: RunWindow
  strings: Strings
  lang: Lang
  /** Local ISO of "now" at the route, for the Today/Tomorrow labels */
  todayIso: string
  featured?: boolean
}

/** End of the window: the last hour it covers, plus that hour itself. */
function endClock(endIso: string): string {
  const h = (Number(endIso.slice(11, 13)) + 1) % 24
  return `${String(h).padStart(2, '0')}:00`
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-[0.8rem] border-[2.5px] border-ink bg-paper px-2.5 py-2 text-center">
      <div className="text-[0.58rem] font-extrabold tracking-[0.1em] uppercase text-ink-soft">{label}</div>
      <div className="font-display mt-0.5 text-base leading-none font-black tabular-nums">{value}</div>
    </div>
  )
}

export function WindowCard({ window: w, strings, lang, todayIso, featured }: Props) {
  const band = bandOf(w.score)
  const day = dayLabel(w.startIso, todayIso, lang, {
    today: strings.windows.today,
    tomorrow: strings.windows.tomorrow,
  })

  return (
    <article
      className={`animate-pop-in relative ${featured ? 'card p-5 sm:p-7' : 'card-sm p-4 sm:p-5'}`}
    >
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <span
            className={`sticker ${BAND_BG[band]} px-3 py-1 text-[0.65rem]`}
            style={{ ['--tilt' as string]: featured ? '-3deg' : '-2deg' }}
          >
            {strings.bands[band]}
          </span>
          <p className="font-display mt-3 text-xs font-black tracking-[0.14em] uppercase text-ink-soft">
            {day}
          </p>
          <p
            className={`font-display leading-none font-black tabular-nums ${
              featured ? 'text-4xl sm:text-5xl' : 'text-3xl'
            }`}
          >
            {clock(w.startIso)}
            <span className="text-ink-soft">→</span>
            {endClock(w.endIso)}
          </p>
          <p className="mt-2 flex items-center gap-2 text-sm font-bold text-ink-soft">
            <WeatherGlyph code={w.weatherCode} isDay={w.isDay} className="h-6 w-6 shrink-0" />
            {strings.wmo[w.weatherCode] ?? ''}
          </p>
        </div>

        <ScoreDial
          score={w.score}
          label={strings.windows.scoreLabel}
          ariaLabel={strings.windows.scoreAria}
          size={featured ? 138 : 108}
        />
      </div>

      {featured && (
        <p className="font-display mt-4 text-lg leading-tight font-extrabold sm:text-xl">
          {strings.verdicts[band]}
        </p>
      )}

      <div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-5">
        <Metric label={strings.windows.feelsLike} value={`${Math.round(w.apparent)}°`} />
        <Metric label={strings.windows.humidityLabel} value={`${Math.round(w.humidity)}%`} />
        <Metric label={strings.windows.rainChance} value={`${Math.round(w.precipProb)}%`} />
        <Metric label={strings.windows.windLabel} value={`${Math.round(w.wind)}`} />
        <Metric label={strings.windows.uvLabel} value={`${Math.round(w.uv)}`} />
      </div>
    </article>
  )
}
