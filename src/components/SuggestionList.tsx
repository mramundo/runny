import { duration, km, runSeconds } from '../lib/format'
import type { Lang, Suggestion } from '../lib/types'
import type { Strings } from '../lib/i18n'

type Props = {
  strings: Strings
  lang: Lang
  suggestions: Suggestion[]
  pace: number
  activeId: string | null
  onPick: (s: Suggestion) => void
}

export function SuggestionList({ strings, lang, suggestions, pace, activeId, onPick }: Props) {
  return (
    <div className="grid gap-3 sm:grid-cols-3">
      {suggestions.map((s) => {
        const active = activeId === s.id
        return (
          <article
            key={s.id}
            className={`tile flex min-w-0 flex-col ${active ? 'border-volt' : ''}`}
          >
            <p className="label clip">{strings.suggest.loopName[s.bearingLabel]}</p>

            <p className="num mt-2 text-3xl leading-none">
              {km(s.meters, lang)}
              <span className="ml-1 font-mono text-xs font-medium text-faint">{strings.units.km}</span>
            </p>
            <p className="mt-1 font-mono text-[0.62rem] text-faint">
              {strings.suggest.targetNote} {s.targetKm} {strings.units.km}
            </p>

            <dl className="hairline mt-4 flex flex-wrap gap-x-5 gap-y-2 pt-3">
              <div className="flex items-baseline gap-1.5 whitespace-nowrap">
                <dt className="label text-[0.58rem]">{strings.route.duration}</dt>
                <dd className="num text-sm">{duration(runSeconds(s.meters, pace), lang)}</dd>
              </div>
              <div className="flex items-baseline gap-1.5 whitespace-nowrap">
                <dt className="label text-[0.58rem]">{strings.route.ascent}</dt>
                <dd className="num text-sm">
                  {s.ascent == null ? '—' : `${s.ascent} ${strings.units.m}`}
                </dd>
              </div>
            </dl>

            <button
              type="button"
              onClick={() => onPick(s)}
              className={`btn mt-4 w-full px-3 py-2.5 ${active ? 'btn-solid' : 'btn-line'}`}
            >
              {strings.suggest.pick}
            </button>
          </article>
        )
      })}
    </div>
  )
}
