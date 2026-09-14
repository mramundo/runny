import { clock, dayLabel } from '../lib/format'
import { bandOf } from '../lib/score'
import { BAND_HEX } from '../lib/bands'
import type { Lang, RunWindow } from '../lib/types'
import type { Strings } from '../lib/i18n'
import { IndexMeter } from './IndexMeter'
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

export function WindowCard({ window: w, strings, lang, todayIso, featured }: Props) {
  const band = bandOf(w.score)
  const day = dayLabel(w.startIso, todayIso, lang, {
    today: strings.windows.today,
    tomorrow: strings.windows.tomorrow,
  })

  // Label and value stay on one line each: the pairs wrap as whole units, so a
  // long word like "Percepita" can never break across two rows.
  const metrics = [
    { label: strings.windows.feelsLike, value: `${Math.round(w.apparent)}°` },
    { label: strings.windows.humidityLabel, value: `${Math.round(w.humidity)}%` },
    { label: strings.windows.rainChance, value: `${Math.round(w.precipProb)}%` },
    { label: strings.windows.windLabel, value: `${Math.round(w.wind)} ${strings.units.kmh}` },
    { label: strings.windows.uvLabel, value: `${Math.round(w.uv)}` },
  ]

  return (
    <article className={`tile animate-rise min-w-0 ${featured ? 'p-5 sm:p-6' : ''}`}>
      <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-1">
        <p className="label">{day}</p>
        <p className="label" style={{ color: BAND_HEX[band] }}>
          {strings.bands[band]}
        </p>
      </div>

      <p className={`num mt-2 leading-none ${featured ? 'text-[clamp(2rem,7vw,3.2rem)]' : 'text-2xl'}`}>
        {clock(w.startIso)}
        <span className="mx-1 text-faint">–</span>
        {endClock(w.endIso)}
      </p>

      <p className="mt-2 flex items-center gap-2 text-sm text-muted">
        <WeatherGlyph code={w.weatherCode} isDay={w.isDay} className="h-5 w-5 shrink-0" />
        <span className="truncate">{strings.wmo[w.weatherCode] ?? ''}</span>
      </p>

      <div className="mt-4">
        <IndexMeter
          score={w.score}
          label={strings.windows.scoreLabel}
          ariaLabel={strings.windows.scoreAria}
          size={featured ? 'big' : 'inline'}
        />
      </div>

      {featured && (
        <p className="clip mt-4 text-lg leading-snug font-semibold sm:text-xl">{strings.verdicts[band]}</p>
      )}

      <dl className="hairline mt-4 flex flex-wrap gap-x-5 gap-y-2 pt-4">
        {metrics.map((m) => (
          <div key={m.label} className="flex items-baseline gap-1.5 whitespace-nowrap">
            <dt className="label text-[0.58rem]">{m.label}</dt>
            <dd className="num text-sm">{m.value}</dd>
          </div>
        ))}
      </dl>
    </article>
  )
}
