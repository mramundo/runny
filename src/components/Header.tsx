import type { Lang } from '../lib/types'
import type { Strings } from '../lib/i18n'
import { RunnerMark } from './RunnerMark'

type Props = {
  strings: Strings
  lang: Lang
  onLang: (lang: Lang) => void
  view: 'planner' | 'faq'
  onView: (view: 'planner' | 'faq') => void
}

export function Header({ strings, lang, onLang, view, onView }: Props) {
  return (
    <header className="flex flex-wrap items-center justify-between gap-4 py-5">
      <button
        type="button"
        className="group flex items-center gap-3 text-left"
        onClick={() => onView('planner')}
        aria-label="Runny"
      >
        <span className="grid h-12 w-12 place-items-center rounded-[0.9rem] border-[3px] border-ink bg-volt-400 shadow-pop-xs sm:h-14 sm:w-14">
          <RunnerMark className="h-8 w-8 text-ink transition group-hover:scale-110 sm:h-9 sm:w-9" />
        </span>
        <span className="leading-none">
          <span className="font-display block text-3xl font-black tracking-tight sm:text-4xl">runny</span>
          <span className="mt-1 block text-[0.68rem] font-extrabold tracking-[0.16em] uppercase text-ink-soft">
            {strings.brandTag}
          </span>
        </span>
      </button>

      <nav className="flex items-center gap-2" aria-label="Runny">
        <button
          type="button"
          onClick={() => onView(view === 'faq' ? 'planner' : 'faq')}
          className="btn-pop bg-white px-4 py-2 text-sm"
        >
          {view === 'faq' ? strings.nav.plan : strings.nav.faq}
        </button>

        <div
          className="flex overflow-hidden rounded-full border-[3px] border-ink bg-white shadow-pop-xs"
          role="group"
          aria-label="Language"
        >
          {(['it', 'en'] as const).map((code) => (
            <button
              key={code}
              type="button"
              onClick={() => onLang(code)}
              aria-pressed={lang === code}
              className={`font-display px-3 py-2 text-sm font-black uppercase transition ${
                lang === code ? 'bg-ink text-volt-400' : 'hover:bg-paper-dim'
              }`}
            >
              {code}
            </button>
          ))}
        </div>
      </nav>
    </header>
  )
}
