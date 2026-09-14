import { DISTANCES } from '../lib/distances'
import { duration, km, runSeconds } from '../lib/format'
import type { Lang, Suggestion } from '../lib/types'
import type { Strings } from '../lib/i18n'

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
    <section className="card p-5 sm:p-7">
      <span className="sticker bg-grape px-3 py-1 text-[0.62rem] text-white">{strings.suggest.kicker}</span>
      <h2 className="font-display mt-3 text-2xl leading-none font-black sm:text-3xl">
        {strings.suggest.title}
      </h2>
      <p className="mt-3 max-w-2xl text-sm font-semibold text-ink-soft">{strings.suggest.lead}</p>

      <div className="mt-5 grid grid-cols-2 gap-2.5 sm:grid-cols-3 lg:grid-cols-6">
        {DISTANCES.map((d, i) => {
          const active = selectedKm === d.km
          return (
            <button
              key={d.km}
              type="button"
              disabled={!hasStart || busy}
              onClick={() => onSelectKm(d.km)}
              aria-pressed={active}
              className={`rounded-[1rem] border-[3px] border-ink px-3 py-3 text-left shadow-pop-xs transition disabled:opacity-45 ${
                active ? 'bg-volt-400' : 'bg-white hover:bg-volt-200'
              }`}
              style={{ transform: `rotate(${i % 2 === 0 ? -1 : 1}deg)` }}
            >
              <span className="font-display block text-xl leading-none font-black">{d.label[lang]}</span>
              <span className="mt-1 block text-[0.62rem] leading-tight font-bold text-ink-soft">
                {d.note[lang]}
              </span>
            </button>
          )
        })}
      </div>

      {!hasStart && <p className="mt-4 text-sm font-bold text-ink-soft">{strings.suggest.needStart}</p>}
      {hasStart && busy && (
        <p className="font-display mt-4 animate-pulse text-sm font-extrabold">{strings.suggest.building}</p>
      )}
      {hasStart && !busy && failed && (
        <p className="mt-4 text-sm font-bold text-heat-600">{strings.suggest.failed}</p>
      )}

      {suggestions.length > 0 && (
        <div className="rail mt-5">
          {suggestions.map((s) => {
            const active = activeId === s.id
            return (
              <article
                key={s.id}
                className={`w-[240px] rounded-[1.1rem] border-[3px] border-ink p-4 shadow-pop-xs ${
                  active ? 'bg-volt-300' : 'bg-white'
                }`}
              >
                <p className="font-display text-xs font-black tracking-[0.12em] uppercase text-ink-soft">
                  {strings.suggest.loopName[s.bearingLabel]}
                </p>
                <p className="font-display mt-1 text-3xl leading-none font-black tabular-nums">
                  {km(s.meters, lang)}
                  <span className="ml-1 text-sm font-extrabold text-ink-soft">{strings.units.km}</span>
                </p>
                <p className="mt-1 text-[0.68rem] font-bold text-ink-soft">
                  {strings.suggest.targetNote} {s.targetKm} {strings.units.km}
                </p>

                <dl className="mt-3 grid grid-cols-2 gap-2 text-center">
                  <div className="rounded-[0.7rem] border-[2.5px] border-ink bg-paper px-2 py-1.5">
                    <dt className="text-[0.55rem] font-extrabold uppercase text-ink-soft">
                      {strings.route.duration}
                    </dt>
                    <dd className="font-display text-sm font-black tabular-nums">
                      {duration(runSeconds(s.meters, pace), lang)}
                    </dd>
                  </div>
                  <div className="rounded-[0.7rem] border-[2.5px] border-ink bg-paper px-2 py-1.5">
                    <dt className="text-[0.55rem] font-extrabold uppercase text-ink-soft">
                      {strings.route.ascent}
                    </dt>
                    <dd className="font-display text-sm font-black tabular-nums">
                      {s.ascent == null ? '—' : `${s.ascent} ${strings.units.m}`}
                    </dd>
                  </div>
                </dl>

                <button
                  type="button"
                  onClick={() => onPick(s)}
                  className="btn-pop mt-3 w-full bg-cool-300 px-3 py-2 text-sm"
                >
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
