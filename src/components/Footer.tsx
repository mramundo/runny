import type { Strings } from '../lib/i18n'
import { RunnerMark } from './RunnerMark'

type Props = { strings: Strings; onView: (view: 'planner' | 'faq') => void }

export function Footer({ strings, onView }: Props) {
  return (
    <footer className="hairline mt-20 pt-8 pb-12">
      <div className="grid gap-8 sm:grid-cols-[1.5fr_1fr]">
        <div className="min-w-0">
          <div className="flex items-center gap-3">
            <RunnerMark className="h-7 w-7 shrink-0 text-volt" trail={false} />
            <span className="h-display text-xl">runny</span>
          </div>
          <p className="clip mt-4 max-w-md text-sm leading-relaxed text-muted">{strings.footer.blurb}</p>
        </div>

        <nav aria-label={strings.footer.sitemap} className="min-w-0">
          <h2 className="label">{strings.footer.sitemap}</h2>
          <ul className="mt-3 space-y-2">
            <li>
              <button type="button" className="text-sm font-semibold text-chalk transition-colors hover:text-volt" onClick={() => onView('planner')}>
                {strings.footer.linkPlan}
              </button>
            </li>
            <li>
              <button type="button" className="text-sm font-semibold text-chalk transition-colors hover:text-volt" onClick={() => onView('faq')}>
                {strings.footer.linkFaq}
              </button>
            </li>
          </ul>
        </nav>
      </div>

      <div className="hairline mt-8 flex flex-wrap items-center justify-between gap-2 pt-5">
        <p className="label">{strings.footer.copy}</p>
        <p className="label clip">{strings.footer.made}</p>
      </div>
    </footer>
  )
}
