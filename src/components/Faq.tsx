import type { Strings } from '../lib/i18n'

type Props = { strings: Strings; onBack: () => void }

export function Faq({ strings, onBack }: Props) {
  return (
    <section className="py-8 sm:py-12">
      <p className="label">{strings.faq.kicker}</p>
      <h1 className="h-display mt-4 text-[clamp(2.1rem,7vw,3.8rem)]">{strings.faq.title}</h1>
      <p className="clip mt-5 max-w-2xl text-[1.02rem] leading-relaxed text-muted">{strings.faq.lead}</p>

      <div className="mt-10">
        {strings.faq.items.map((item, i) => (
          <details key={item.q} className="hairline group" open={i === 0}>
            <summary className="flex cursor-pointer list-none items-start gap-4 py-5 marker:hidden">
              <span className="num mt-1 shrink-0 text-[0.7rem] text-faint">
                {String(i + 1).padStart(2, '0')}
              </span>
              <span className="clip flex-1 text-lg leading-snug font-semibold transition-colors group-open:text-volt sm:text-xl">
                {item.q}
              </span>
              {/* The glyph turns inside a fixed box: rotating the flex item
                  itself would push its painted bounds past the row. */}
              <span className="mt-1 grid h-5 w-5 shrink-0 place-items-center" aria-hidden="true">
                <span className="font-mono text-sm leading-none text-faint transition-transform group-open:rotate-45">
                  +
                </span>
              </span>
            </summary>
            <p className="clip pb-6 pl-10 text-[0.98rem] leading-relaxed text-muted">{item.a}</p>
          </details>
        ))}
      </div>

      <div className="hairline mt-10 flex flex-wrap items-center justify-between gap-4 pt-8">
        <button type="button" onClick={onBack} className="btn btn-solid px-6 py-3">
          {strings.nav.backToPlanner}
        </button>
        <p className="label clip">{strings.faq.outro}</p>
      </div>
    </section>
  )
}
