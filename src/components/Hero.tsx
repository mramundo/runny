import type { Strings } from '../lib/i18n'
import { RunnerMark } from './RunnerMark'

type Props = { strings: Strings; onStart: () => void; onFaq: () => void }

export function Hero({ strings, onStart, onFaq }: Props) {
  return (
    <section className="py-10 sm:py-16">
      <p className="label">{strings.hero.kicker}</p>

      <h1 className="h-display mt-5 text-[clamp(2.6rem,10vw,5.6rem)]">
        <span className="block">{strings.hero.titleA}</span>
        <span className="block text-volt">{strings.hero.titleB}</span>
      </h1>

      <div className="mt-8 grid gap-8 md:grid-cols-[1fr_auto] md:items-end">
        <p className="clip max-w-2xl text-[1.05rem] leading-relaxed text-muted sm:text-lg">
          {strings.hero.lead}
        </p>

        <div className="flex flex-wrap gap-3 md:flex-nowrap md:justify-end">
          <button type="button" onClick={onStart} className="btn btn-solid px-6 py-3">
            {strings.hero.cta}
          </button>
          <button type="button" onClick={onFaq} className="btn btn-line px-6 py-3">
            {strings.hero.ghost}
          </button>
        </div>
      </div>

      <div className="mt-12 flex items-center gap-3" aria-hidden="true">
        <RunnerMark className="h-5 w-5 shrink-0 text-volt" trail={false} />
        <span className="h-px flex-1 bg-line-soft" />
      </div>
    </section>
  )
}
