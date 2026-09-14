type Streak = { top: string; width: number; height: number; dur: number; delay: number; color: string; opacity: number }

const COLORS = ['var(--color-volt-500)', 'var(--color-cool-400)', 'var(--color-ink)', 'var(--color-grape)']

/** Deterministic layout: the background must not reshuffle on every render. */
const STREAKS: Streak[] = Array.from({ length: 14 }, (_, i) => {
  const seed = (i * 37) % 100
  return {
    top: `${4 + ((i * 7.3) % 92)}%`,
    width: 90 + ((seed * 3) % 260),
    height: i % 3 === 0 ? 10 : 6,
    dur: 11 + ((seed % 9) * 1.6),
    delay: -(i * 1.9),
    color: COLORS[i % COLORS.length],
    opacity: i % 3 === 0 ? 0.24 : 0.16,
  }
})

/**
 * Motion streaks drifting across the page behind everything. Pure atmosphere:
 * fixed, non-interactive, and switched off entirely for reduced motion.
 */
export function SpeedField() {
  return (
    <div className="speed-field" aria-hidden="true">
      {STREAKS.map((s, i) => (
        <span
          key={i}
          className="speed-streak"
          style={
            {
              '--y': s.top,
              '--w': `${s.width}px`,
              '--h': `${s.height}px`,
              '--d': `${s.dur}s`,
              '--delay': `${s.delay}s`,
              '--c': s.color,
              '--o': s.opacity,
              top: s.top,
            } as React.CSSProperties
          }
        />
      ))}
    </div>
  )
}
