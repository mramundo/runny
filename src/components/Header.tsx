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
    <header className="flex items-center justify-between gap-4 py-5">
      <button type="button" className="group flex min-w-0 items-center gap-3" onClick={() => onView('planner')}>
        <RunnerMark className="h-9 w-9 shrink-0 text-volt transition-transform group-hover:translate-x-0.5 sm:h-10 sm:w-10" />
        <span className="min-w-0 text-left">
          <span className="h-display block text-2xl text-chalk sm:text-[1.7rem]">runny</span>
          <span className="label block truncate">{strings.brandTag}</span>
        </span>
      </button>

      <nav className="flex shrink-0 items-center gap-3 sm:gap-5" aria-label="Runny">
        <button
          type="button"
          onClick={() => onView(view === 'faq' ? 'planner' : 'faq')}
          className="label transition-colors hover:text-volt"
        >
          {view === 'faq' ? strings.nav.plan : strings.nav.faq}
        </button>

        <span className="h-4 w-px bg-line" aria-hidden="true" />

        <div className="flex items-center gap-1.5" role="group" aria-label="Language">
          {(['it', 'en'] as const).map((code, i) => (
            <span key={code} className="flex items-center gap-1.5">
              {i > 0 && (
                <span className="font-mono text-[0.66rem] text-faint" aria-hidden="true">
                  /
                </span>
              )}
              <button
                type="button"
                onClick={() => onLang(code)}
                aria-pressed={lang === code}
                className={`font-mono text-[0.66rem] tracking-[0.2em] uppercase transition-colors ${
                  lang === code ? 'text-volt' : 'text-faint hover:text-chalk'
                }`}
              >
                {code}
              </button>
            </span>
          ))}
        </div>
      </nav>
    </header>
  )
}
