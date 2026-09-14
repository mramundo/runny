const ACCENTS = ['var(--color-volt)', 'var(--color-ice)', 'var(--color-flare)']

/** Fixed positions: the background must not reshuffle on every render. */
const LANES = Array.from({ length: 9 }, (_, i) => ({
  left: `${6 + i * 11}%`,
  dur: 7 + ((i * 2.6) % 9),
  delay: -(i * 1.7),
  accent: ACCENTS[i % ACCENTS.length],
}))

/**
 * Hairline lanes with a light running down them, like a timing board
 * refreshing. Fixed, non-interactive, removed entirely for reduced motion.
 */
export function Lanes() {
  return (
    <div className="lanes" aria-hidden="true">
      {LANES.map((lane, i) => (
        <div key={i} className="lane" style={{ left: lane.left }}>
          <span
            style={
              {
                '--d': `${lane.dur}s`,
                '--delay': `${lane.delay}s`,
                '--c': lane.accent,
              } as React.CSSProperties
            }
          />
        </div>
      ))}
    </div>
  )
}
