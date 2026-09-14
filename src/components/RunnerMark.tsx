type Props = {
  className?: string
  /** Cycles the legs, for the logo on hover and the loading state */
  running?: boolean
  /** Speed lines trailing the figure */
  trail?: boolean
  title?: string
}

/**
 * The whole brand in one pictogram: a runner leaning into the direction of
 * travel, drawn with the same heavy strokes as every border in the app.
 */
export function RunnerMark({ className, running, trail = true, title }: Props) {
  return (
    <svg
      viewBox="0 0 64 64"
      className={className}
      role={title ? 'img' : 'presentation'}
      aria-label={title}
      aria-hidden={title ? undefined : true}
      fill="none"
    >
      {trail && (
        <g stroke="currentColor" strokeWidth="4" strokeLinecap="round" opacity="0.45">
          <path d="M4 20h9" />
          <path d="M2 31h7" />
          <path d="M6 42h8" />
        </g>
      )}
      <g
        className={running ? 'animate-stride' : undefined}
        style={{ transformOrigin: '32px 32px' }}
        stroke="currentColor"
        strokeWidth="6"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <circle cx="44" cy="12.5" r="6.5" fill="currentColor" stroke="none" />
        <path d="M40.5 22 30 33" />
        <path d="M40 24.5 50 29.5 56.5 23" />
        <path d="M35.5 27 26 23.5 20.5 29" />
        <path d="M30 33 39.5 40 37.5 52.5" />
        <path d="M30 33 20 43.5 11.5 41.5" />
      </g>
    </svg>
  )
}
