import { DISTANCES } from '../lib/distances'
import { DATE_LOCALE } from '../lib/i18n'
import type { Lang } from '../lib/types'

type Props = {
  lang: Lang
  selected: number | null
  disabled: boolean
  onSelect: (km: number) => void
}

/** 21.1 reads as "21,1" in Italian and "21.1" in English. */
function label(km: number, lang: Lang): string {
  return km.toLocaleString(DATE_LOCALE[lang], { maximumFractionDigits: 1 })
}

export function DistanceGrid({ lang, selected, disabled, onSelect }: Props) {
  return (
    <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-4">
      {DISTANCES.map((d) => {
        const active = selected === d.km
        return (
          <button
            key={d.km}
            type="button"
            disabled={disabled}
            onClick={() => onSelect(d.km)}
            aria-pressed={active}
            className={`min-w-0 rounded-[5px] border px-3 py-3 text-left transition-colors disabled:opacity-35 ${
              active
                ? 'border-volt bg-raised'
                : 'border-line-soft bg-raised hover:border-line hover:bg-panel'
            }`}
          >
            <span className={`num block text-lg leading-none ${active ? 'text-volt' : 'text-chalk'}`}>
              {label(d.km, lang)}
              <span className="ml-1 font-mono text-[0.62rem] font-medium text-faint">km</span>
            </span>
            <span className="clip mt-1.5 block font-mono text-[0.6rem] leading-tight text-faint">
              {d.note[lang]}
            </span>
          </button>
        )
      })}
    </div>
  )
}
