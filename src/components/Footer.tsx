import type { Strings } from '../lib/i18n'
import { RunnerMark } from './RunnerMark'

type Props = { strings: Strings; onView: (view: 'planner' | 'faq') => void }

const REPO = 'https://github.com/mramundo/runny'

export function Footer({ strings, onView }: Props) {
  return (
    <footer className="mt-16 border-t-4 border-ink pt-8 pb-10">
      <div className="grid gap-8 sm:grid-cols-[1.4fr_1fr]">
        <div>
          <div className="flex items-center gap-3">
            <span className="grid h-11 w-11 place-items-center rounded-[0.8rem] border-[3px] border-ink bg-volt-400">
              <RunnerMark className="h-7 w-7 text-ink" />
            </span>
            <span className="font-display text-2xl font-black">runny</span>
          </div>
          <p className="mt-4 max-w-md text-sm leading-relaxed font-semibold text-ink-soft">
            {strings.footer.blurb}
          </p>
        </div>

        <nav aria-label={strings.footer.sitemap}>
          <h2 className="font-display text-xs font-black tracking-[0.16em] uppercase">
            {strings.footer.sitemap}
          </h2>
          <ul className="mt-3 space-y-2 text-sm font-bold">
            <li>
              <button type="button" className="hover:text-cool-600 underline decoration-[3px] underline-offset-4" onClick={() => onView('planner')}>
                {strings.footer.linkPlan}
              </button>
            </li>
            <li>
              <button type="button" className="hover:text-cool-600 underline decoration-[3px] underline-offset-4" onClick={() => onView('faq')}>
                {strings.footer.linkFaq}
              </button>
            </li>
            <li>
              <a
                className="hover:text-cool-600 underline decoration-[3px] underline-offset-4"
                href={REPO}
                target="_blank"
                rel="noopener noreferrer"
              >
                {strings.footer.linkRepo}
              </a>
            </li>
          </ul>
        </nav>
      </div>

      <p className="mt-8 text-xs font-semibold text-ink-soft">{strings.footer.data}</p>
      <p className="mt-2 text-xs font-bold">
        {strings.footer.copy} · <span className="text-ink-soft">{strings.footer.joke}</span>
      </p>
    </footer>
  )
}
