import { DISTANCES } from '../lib/distances'
import { duration, km, runSeconds } from '../lib/format'
import type { Lang, Suggestion } from '../lib/types'
import type { Strings } from '../lib/i18n'
import { SectionHead } from './SectionHead'

type Props = {
  strings: Strings
  lang: Lang
  hasStart: boolean
  pace: number
  selectedKm: number | null
  onSelectKm: (km: number) => void
  suggestions: Suggestion[]
  busy: boolean
  failed: boolean
  activeId: string | null
  onPick: (s: Suggestion) => void
}

export function Suggestions({
  strings,
  lang,
  hasStart,
  pace,
  selectedKm,
  onSelectKm,
  suggestions,
  busy,
  failed,
  activeId,
  onPick,
}: Props) {
  return (
    <section className="panel tick tick-ice p-5 sm:p-7">
      <SectionHead kicker={strings.suggest.kicker} title={strings.suggest.title} />
      <p className="clip mt-4 max-w-2xl text-[0.95rem] leading-relaxed text-muted">{strings.suggest.lead}</p>

      <div className="mt-6 grid grid-cols-2 gap-px bg-line-soft sm:grid-cols-3 lg:grid-cols-6">
        {DISTANCES.map((d) => {
          const active = selectedKm === d.km
          return (
            <button
              key={d.km}
              type="button"
              disabled={!hasStart || busy}
              onClick={() => onSelectKm(d.km)}
              aria-pressed={active}
              className={`min-w-0 px-3 py-4 text-left transition-colors disabled:opacity-35 ${
                active ? 'bg-raised' : 'bg-pit hover:bg-raised'
              }`}
            >
              <span className={`num block text-xl leading-none ${active ? 'text-volt' : 'text-chalk'}`}>
                {d.label[lang]}
              </span>
              <span className="clip mt-2 block font-mono text-[0.6rem] leading-tight text-faint">
                {d.note[lang]}
              </span>
            </button>
          )
        })}
      </div>

      {!hasStart && <p className="label mt-4">{strings.suggest.needStart}</p>}
      {hasStart && busy && <p className="label animate-blink mt-4 text-volt">{strings.suggest.building}…</p>}
      {hasStart && !busy && failed && <p className="clip mt-4 text-sm text-flare">{strings.suggest.failed}</p>}

      {suggestions.length > 0 && (
        <div className="rail mt-6">
          {suggestions.map((s) => {
            const active = activeId === s.id
            return (
              <article
                key={s.id}
                className={`w-[224px] border p-4 ${
                  active ? 'border-volt bg-raised' : 'border-line bg-pit'
                }`}
                style={{ borderRadius: 5 }}
              >
                <p className="label">{strings.suggest.loopName[s.bearingLabel]}</p>
                <p className="num mt-2 text-3xl leading-none">
                  {km(s.meters, lang)}
                  <span className="ml-1 font-mono text-xs font-medium text-faint">{strings.units.km}</span>
                </p>
                <p className="mt-1 font-mono text-[0.62rem] text-faint">
                  {strings.suggest.targetNote} {s.targetKm} {strings.units.km}
                </p>

                <dl className="hairline mt-4 grid grid-cols-2 gap-3 pt-3">
                  <div className="min-w-0">
                    <dt className="label text-[0.58rem]">{strings.route.duration}</dt>
                    <dd className="num mt-1 text-sm">{duration(runSeconds(s.meters, pace), lang)}</dd>
                  </div>
                  <div className="min-w-0">
                    <dt className="label text-[0.58rem]">{strings.route.ascent}</dt>
                    <dd className="num mt-1 text-sm">
                      {s.ascent == null ? '—' : `${s.ascent} ${strings.units.m}`}
                    </dd>
                  </div>
                </dl>

                <button type="button" onClick={() => onPick(s)} className="btn btn-line mt-4 w-full px-3 py-2.5">
                  {strings.suggest.pick}
                </button>
              </article>
            )
          })}
        </div>
      )}
    </section>
  )
}
