import type { Strings } from '../lib/i18n'
import { RunnerMark } from './RunnerMark'

type Props = { strings: Strings; onBack: () => void }

export function Faq({ strings, onBack }: Props) {
  return (
    <section className="py-6">
      <span className="sticker bg-cool-300 px-3 py-1 text-[0.65rem]">{strings.nav.faq}</span>
      <h1 className="font-display mt-4 text-4xl leading-[0.95] font-black tracking-tight sm:text-5xl">
        <span className="squiggle inline-block">{strings.faq.title}</span>
      </h1>
      <p className="mt-4 max-w-2xl text-base font-semibold text-ink-soft">{strings.faq.lead}</p>

      <div className="mt-8 space-y-3">
        {strings.faq.items.map((item, i) => (
          <details key={item.q} className="card-flat group overflow-hidden" open={i === 0}>
            <summary className="font-display flex cursor-pointer list-none items-center justify-between gap-4 px-5 py-4 text-lg font-extrabold marker:hidden">
              <span>{item.q}</span>
              <span className="grid h-7 w-7 shrink-0 place-items-center rounded-full border-[2.5px] border-ink bg-volt-400 text-base leading-none font-black transition group-open:rotate-45">
                +
              </span>
            </summary>
            <p className="border-t-[3px] border-ink/15 px-5 py-4 text-[0.95rem] leading-relaxed font-semibold text-ink-soft">
              {item.a}
            </p>
          </details>
        ))}
      </div>

      <div className="mt-10 flex flex-wrap items-center gap-4">
        <button type="button" onClick={onBack} className="btn-pop bg-volt-400 px-5 py-3">
          {strings.nav.backToPlanner}
        </button>
        <span className="flex items-center gap-2 text-sm font-bold text-ink-soft">
          <RunnerMark className="h-6 w-6 text-ink" trail={false} />
          {strings.faq.outro}
        </span>
      </div>
    </section>
  )
}
