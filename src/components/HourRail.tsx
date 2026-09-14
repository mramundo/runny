import { BAND_HEX } from '../lib/bands'
import { clock, dayLabel } from '../lib/format'
import { bandOf } from '../lib/score'
import type { HourPoint, Lang } from '../lib/types'
import type { Strings } from '../lib/i18n'

type Props = {
  hours: HourPoint[]
  strings: Strings
  lang: Lang
  todayIso: string
  now: number
}

const BAR_MAX = 92

/**
 * Every hour on one strip, grouped into days. The day name sits above its own
 * block of columns — no rotated labels, so nothing can escape its column.
 */
export function HourRail({ hours, strings, lang, todayIso, now }: Props) {
  const visible = hours.filter((h) => h.t >= now - 3_600_000).slice(0, 72)

  const days: { key: string; label: string; hours: HourPoint[] }[] = []
  for (const h of visible) {
    const key = h.time.slice(0, 10)
    const last = days[days.length - 1]
    if (last && last.key === key) {
      last.hours.push(h)
    } else {
      days.push({
        key,
        label: dayLabel(h.time, todayIso, lang, {
          today: strings.windows.today,
          tomorrow: strings.windows.tomorrow,
        }),
        hours: [h],
      })
    }
  }

  return (
    <div className="rail" role="list" aria-label={strings.windows.hourlyAria}>
      {days.map((day, i) => (
        <section key={day.key} role="listitem" className={i > 0 ? 'border-l border-line-soft pl-3' : undefined}>
          <p className="label mb-3 whitespace-nowrap">{day.label}</p>
          <div className="flex gap-1">
            {day.hours.map((h) => {
              const current = h.t <= now && now < h.t + 3_600_000
              return (
                <div key={h.time} className="flex w-[34px] shrink-0 flex-col items-center">
                  <span
                    className={`font-mono text-[0.58rem] tabular-nums ${current ? 'text-volt' : 'text-faint'}`}
                  >
                    {current ? strings.windows.now : clock(h.time).slice(0, 2)}
                  </span>
                  <div className="mt-2 flex h-[92px] w-full items-end justify-center">
                    <div
                      className="w-[10px] rounded-[1px]"
                      style={{
                        height: `${Math.max(3, (h.score / 100) * BAR_MAX)}px`,
                        background: BAND_HEX[bandOf(h.score)],
                        opacity: current ? 1 : 0.82,
                      }}
                    />
                  </div>
                  <span className="num mt-2 text-[0.66rem] leading-none text-chalk">{h.score}</span>
                  <span className="mt-1 font-mono text-[0.56rem] tabular-nums text-faint">
                    {Math.round(h.apparent)}°
                  </span>
                </div>
              )
            })}
          </div>
        </section>
      ))}
    </div>
  )
}
