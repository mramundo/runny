import { useCallback, useEffect, useRef, useState } from 'react'
import { RunnerMark } from './RunnerMark'

const POKES_TO_RUN = 5
/** Five deliberate taps, not five spread across a minute. */
const POKE_WINDOW_MS = 1200
const DASH_MS = 1500
/** Width of the runner plus the gap it clears in the rule, in pixels. */
const RUNNER_BOX = 28

type Phase = 'idle' | 'out' | 'back'

/**
 * The divider under the hero, with a runner sitting on it. Tap the runner five
 * times and it sprints to the far end, turns round, and comes back to where it
 * started. Decorative only — nothing depends on it.
 */
export function RunnerDash({ className }: { className?: string }) {
  const [phase, setPhase] = useState<Phase>('idle')
  const pokes = useRef(0)
  const pokeTimer = useRef<number | null>(null)
  const safety = useRef<number | null>(null)

  const advance = useCallback(() => {
    if (safety.current) {
      clearTimeout(safety.current)
      safety.current = null
    }
    setPhase((p) => (p === 'out' ? 'back' : 'idle'))
  }, [])

  useEffect(() => {
    if (phase === 'idle') return
    // `transitionend` is the real signal; this only covers the case where the
    // tab is hidden and the transition never gets to run.
    safety.current = window.setTimeout(advance, DASH_MS + 400)
    return () => {
      if (safety.current) clearTimeout(safety.current)
    }
  }, [advance, phase])

  useEffect(
    () => () => {
      if (pokeTimer.current) clearTimeout(pokeTimer.current)
      if (safety.current) clearTimeout(safety.current)
    },
    [],
  )

  function poke() {
    if (phase !== 'idle') return
    if (pokeTimer.current) clearTimeout(pokeTimer.current)
    pokes.current += 1

    if (pokes.current >= POKES_TO_RUN) {
      pokes.current = 0
      setPhase('out')
      return
    }
    pokeTimer.current = window.setTimeout(() => {
      pokes.current = 0
    }, POKE_WINDOW_MS)
  }

  const running = phase !== 'idle'

  return (
    <div className={`relative flex h-5 items-center ${className ?? ''}`}>
      <span className="absolute inset-x-0 top-1/2 h-px -translate-y-1/2 bg-line-soft" aria-hidden="true" />

      {/* Hidden from assistive tech on purpose: it is a joke with no function,
          and announcing a nameless control would only get in the way. */}
      <button
        type="button"
        aria-hidden="true"
        tabIndex={-1}
        onClick={poke}
        onTransitionEnd={(e) => {
          if (e.propertyName === 'left') advance()
        }}
        className="runner-dash absolute top-0 cursor-pointer bg-void px-1"
        style={{ left: phase === 'out' ? `calc(100% - ${RUNNER_BOX}px)` : '0px' }}
      >
        <RunnerMark
          className={`h-5 w-5 text-volt ${running ? 'animate-stride' : ''} ${
            phase === 'back' ? '-scale-x-100' : ''
          }`}
          trail={running}
        />
      </button>
    </div>
  )
}
