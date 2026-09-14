import { duration, km, runSeconds } from '../lib/format'
import type { Lang, RoutePlan } from '../lib/types'
import type { Strings } from '../lib/i18n'
import { MapView } from './MapView'

type Props = {
  strings: Strings
  lang: Lang
  plan: RoutePlan
  ghosts?: [number, number][][]
  pace: number
  sampleCount: number | null
}

function Stat({ label, value, unit, hint }: { label: string; value: string; unit?: string; hint?: string }) {
  return (
    <div className="rounded-[1rem] border-[3px] border-ink bg-paper px-3 py-3">
      <div className="text-[0.6rem] font-extrabold tracking-[0.1em] uppercase text-ink-soft">{label}</div>
      <div className="font-display mt-1 text-2xl leading-none font-black tabular-nums">
        {value}
        {unit && <span className="ml-1 text-xs font-extrabold text-ink-soft">{unit}</span>}
      </div>
      {hint && <div className="mt-1 text-[0.6rem] leading-tight font-semibold text-ink-soft">{hint}</div>}
    </div>
  )
}

export function RouteCard({ strings, lang, plan, ghosts, pace, sampleCount }: Props) {
  const osm = `https://www.openstreetmap.org/directions?engine=fossgis_valhalla_foot&route=${plan.points[0][0].toFixed(5)}%2C${plan.points[0][1].toFixed(5)}%3B${plan.points[plan.points.length - 1][0].toFixed(5)}%2C${plan.points[plan.points.length - 1][1].toFixed(5)}`

  return (
    <section className="card p-5 sm:p-7">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <span className="sticker bg-cool-300 px-3 py-1 text-[0.62rem]">{strings.route.kicker}</span>
          <h2 className="font-display mt-3 text-2xl leading-none font-black sm:text-3xl">
            {strings.route.title}
          </h2>
        </div>
        <a href={osm} target="_blank" rel="noopener noreferrer" className="btn-pop bg-white px-4 py-2.5 text-sm">
          {strings.route.openInOsm}
        </a>
      </div>

      <div className="mt-5 grid gap-2.5 sm:grid-cols-4">
        <Stat label={strings.route.distance} value={km(plan.meters, lang)} unit={strings.units.km} />
        <Stat label={strings.route.duration} value={duration(runSeconds(plan.meters, pace), lang)} />
        <Stat
          label={strings.route.ascent}
          value={plan.ascent == null ? '—' : String(plan.ascent)}
          unit={plan.ascent == null ? undefined : strings.units.m}
        />
        <Stat
          label={strings.route.samples}
          value={sampleCount == null ? '—' : String(sampleCount)}
          hint={strings.route.samplesHint}
        />
      </div>

      <div className="mt-5">
        <MapView
          plan={plan}
          ghosts={ghosts}
          startLabel={strings.route.legendStart.slice(0, 1)}
          endLabel={strings.route.legendEnd.slice(0, 1)}
          attribution={strings.route.attribution}
          ariaLabel={strings.route.mapAria}
        />
      </div>

      <div className="mt-3 flex flex-wrap gap-4 text-xs font-bold">
        <span className="flex items-center gap-2">
          <span className="inline-block h-4 w-4 rounded-full border-[2.5px] border-ink bg-volt-400" />
          {strings.route.legendStart}
        </span>
        {plan.kind !== 'loop' && (
          <span className="flex items-center gap-2">
            <span className="inline-block h-4 w-4 rounded-full border-[2.5px] border-ink bg-cool-300" />
            {strings.route.legendEnd}
          </span>
        )}
      </div>
    </section>
  )
}
