import type { Strings } from '../lib/i18n'
import { RunnerMark } from './RunnerMark'

type Props = { strings: Strings; onStart: () => void; onFaq: () => void }

export function Hero({ strings, onStart, onFaq }: Props) {
  return (
    <section className="relative py-6 sm:py-10">
      <div className="grid items-center gap-8 md:grid-cols-[1.15fr_0.85fr]">
        <div>
          <h1 className="font-display text-[2.6rem] leading-[0.92] font-black tracking-tight sm:text-6xl lg:text-7xl">
            {strings.hero.titleA}{' '}
            <span className="squiggle squiggle-volt inline-block">{strings.hero.titleB}</span>
          </h1>

          <p className="mt-6 max-w-xl text-base leading-relaxed font-semibold text-ink-soft sm:text-lg">
            {strings.hero.lead}
          </p>

          <div className="mt-7 flex flex-wrap gap-3">
            <button type="button" onClick={onStart} className="btn-pop bg-volt-400 px-6 py-3 text-base sm:text-lg">
              {strings.hero.cta}
            </button>
            <button type="button" onClick={onFaq} className="btn-pop bg-white px-6 py-3 text-base sm:text-lg">
              {strings.hero.ghost}
            </button>
          </div>

          <ul className="mt-6 flex flex-wrap gap-2">
            {[strings.hero.badge1, strings.hero.badge2, strings.hero.badge3].map((b, i) => (
              <li
                key={b}
                className="chip bg-white px-3 py-1.5 text-xs"
                style={{ transform: `rotate(${i === 1 ? 1.5 : -1.5}deg)` }}
              >
                {b}
              </li>
            ))}
          </ul>
        </div>

        <div className="relative mx-auto w-full max-w-[320px]">
          <div className="absolute -top-4 -left-3 z-10 rotate-[-8deg] rounded-[0.8rem] border-[3px] border-ink bg-cool-300 px-3 py-1.5 shadow-pop-xs">
            <span className="font-display text-sm font-black tabular-nums">12° · UV 1</span>
          </div>
          <div className="absolute -right-2 bottom-6 z-10 rotate-[7deg] rounded-[0.8rem] border-[3px] border-ink bg-heat-400 px-3 py-1.5 shadow-pop-xs">
            <span className="font-display text-sm font-black tabular-nums">31° · UV 9</span>
          </div>
          <div className="animate-float grid aspect-square place-items-center rounded-[2rem] border-4 border-ink bg-volt-400 shadow-pop-lg">
            <RunnerMark className="h-[62%] w-[62%] text-ink" running />
          </div>
        </div>
      </div>
    </section>
  )
}
