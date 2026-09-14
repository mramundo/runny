import { BAND_HEX } from '../lib/bands'
import { clock, dayLabel } from '../lib/format'
import { bandOf } from '../lib/score'
import type { HourPoint, Lang } from '../lib/types'
import type { Strings } from '../lib/i18n'
import { WeatherGlyph } from './WeatherGlyph'

type Props = {
  hours: HourPoint[]
  strings: Strings
  lang: Lang
  todayIso: string
  now: number
}

const BAR_MAX = 116

/**
 * Every hour Runny knows about, as a wall of bars. Bands are read from colour,
 * the exact number sits under each bar, and days are separated by a divider so
 * a 72-hour strip still parses at a glance.
 */
export function HourRail({ hours, strings, lang, todayIso, now }: Props) {
  const visible = hours.filter((h) => h.t >= now - 3_600_000).slice(0, 72)

  return (
    <div className="rail" role="list" aria-label={strings.windows.hourlyAria}>
      {visible.map((h, i) => {
        const isNewDay = i === 0 || h.time.slice(0, 10) !== visible[i - 1].time.slice(0, 10)
        const band = bandOf(h.score)
        const current = h.t <= now && now < h.t + 3_600_000
        return (
          <div key={h.time} className="flex items-stretch gap-3" role="listitem">
            {isNewDay && (
              <div className="flex w-px shrink-0 items-end">
                <span className="font-display -rotate-90 origin-bottom-left translate-x-4 text-[0.6rem] font-black tracking-[0.14em] whitespace-nowrap uppercase text-ink-soft">
                  {dayLabel(h.time, todayIso, lang, {
                    today: strings.windows.today,
                    tomorrow: strings.windows.tomorrow,
                  })}
                </span>
              </div>
            )}
            <div
              className={`flex w-[52px] flex-col items-center rounded-[0.8rem] border-[2.5px] px-1 pt-2 pb-2 ${
                current ? 'border-ink bg-volt-200' : 'border-ink/25 bg-white'
              }`}
            >
              <span className="text-[0.62rem] font-extrabold tabular-nums text-ink-soft">
                {current ? strings.windows.now : clock(h.time)}
              </span>
              <WeatherGlyph code={h.weatherCode} isDay={h.isDay} className="mt-1 h-5 w-5" />
              <div className="mt-2 flex h-[116px] w-full items-end justify-center">
                <div
                  className="w-5 rounded-t-[6px] border-[2.5px] border-ink transition-[height]"
                  style={{
                    height: `${Math.max(8, (h.score / 100) * BAR_MAX)}px`,
                    background: BAND_HEX[band],
                  }}
                />
              </div>
              <span className="font-display mt-1.5 text-sm leading-none font-black tabular-nums">
                {h.score}
              </span>
              <span className="mt-1 text-[0.6rem] font-bold tabular-nums text-ink-soft">
                {Math.round(h.apparent)}°
              </span>
            </div>
          </div>
        )
      })}
    </div>
  )
}
