import { duration, km, runSeconds } from '../lib/format'
import type { Lang, RoutePlan } from '../lib/types'
import type { Strings } from '../lib/i18n'
import { MapView } from './MapView'
import { SectionHead } from './SectionHead'

type Props = {
  strings: Strings
  lang: Lang
  plan: RoutePlan
  ghosts?: [number, number][][]
  pace: number
  sampleCount: number | null
}

function Stat({ label, value, unit }: { label: string; value: string; unit?: string }) {
  return (
    <div className="tile min-w-0">
      <p className="label clip">{label}</p>
      <p className="num mt-2 text-2xl leading-none sm:text-[1.7rem]">
        {value}
        {unit && <span className="ml-1 font-mono text-[0.66rem] font-medium text-faint">{unit}</span>}
      </p>
    </div>
  )
}

export function RouteCard({ strings, lang, plan, ghosts, pace, sampleCount }: Props) {
  return (
    <section className="panel tick tick-flare">
      <SectionHead kicker={strings.route.kicker} title={strings.route.title} />

      <div className="mt-6 grid grid-cols-2 gap-2 sm:grid-cols-4">
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
          unit={sampleCount == null ? undefined : strings.route.samplesUnit}
        />
      </div>

      <p className="clip mt-3 font-mono text-[0.68rem] text-faint">{strings.route.samplesHint}</p>

      <div className="mt-5 overflow-hidden rounded-[5px] border border-line-soft">
        <MapView
          plan={plan}
          ghosts={ghosts}
          attribution={strings.route.attribution}
          ariaLabel={strings.route.mapAria}
        />
      </div>

      <div className="mt-4 flex flex-wrap gap-5">
        <span className="label flex items-center gap-2">
          <span className="inline-block h-2 w-2 rounded-full bg-volt" />
          {strings.route.legendStart}
        </span>
        {plan.kind !== 'loop' && (
          <span className="label flex items-center gap-2">
            <span className="inline-block h-2 w-2 rounded-full bg-ice" />
            {strings.route.legendEnd}
          </span>
        )}
      </div>
    </section>
  )
}
