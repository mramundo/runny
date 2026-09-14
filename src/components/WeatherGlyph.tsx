type Props = { code: number; isDay?: boolean; className?: string }

type Kind = 'clear' | 'partly' | 'cloud' | 'fog' | 'drizzle' | 'rain' | 'snow' | 'storm'

function kindOf(code: number): Kind {
  if (code === 0 || code === 1) return 'clear'
  if (code === 2) return 'partly'
  if (code === 3) return 'cloud'
  if (code === 45 || code === 48) return 'fog'
  if (code >= 51 && code <= 57) return 'drizzle'
  if ((code >= 61 && code <= 67) || (code >= 80 && code <= 82)) return 'rain'
  if ((code >= 71 && code <= 77) || code === 85 || code === 86) return 'snow'
  if (code >= 95) return 'storm'
  return 'cloud'
}

const CLOUD = 'M20 40h22a8 8 0 0 0 0-16 12 12 0 0 0-22.7-3.6A8.2 8.2 0 0 0 20 40Z'

/**
 * A tiny hand-rolled icon set. Six shapes cover every WMO code the forecast
 * returns, and they inherit the surrounding colour like the rest of the marks.
 */
export function WeatherGlyph({ code, isDay = true, className }: Props) {
  const kind = kindOf(code)
  return (
    <svg
      viewBox="0 0 56 56"
      className={className}
      aria-hidden="true"
      fill="none"
      stroke="currentColor"
      strokeWidth="3.4"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {kind === 'clear' && (
        <g>
          {isDay ? (
            <>
              <circle cx="28" cy="28" r="10" fill="currentColor" stroke="none" />
              <g>
                <path d="M28 8v5M28 43v5M8 28h5M43 28h5M14 14l3.5 3.5M38.5 38.5 42 42M42 14l-3.5 3.5M17.5 38.5 14 42" />
              </g>
            </>
          ) : (
            <path
              d="M36 32a14 14 0 0 1-15.6-19.4A14 14 0 1 0 40 36.4 13.9 13.9 0 0 1 36 32Z"
              fill="currentColor"
              stroke="none"
            />
          )}
        </g>
      )}

      {kind === 'partly' && (
        <g>
          <circle cx="21" cy="20" r="7" fill="currentColor" stroke="none" />
          <path d={CLOUD} fill="#fff" />
        </g>
      )}

      {kind === 'cloud' && <path d={CLOUD} fill="#fff" />}

      {kind === 'fog' && (
        <g>
          <path d={CLOUD} fill="#fff" />
          <path d="M12 46h32M18 52h22" />
        </g>
      )}

      {kind === 'drizzle' && (
        <g>
          <path d={CLOUD} fill="#fff" />
          <path d="M22 45v3M31 45v4M40 45v3" />
        </g>
      )}

      {kind === 'rain' && (
        <g>
          <path d={CLOUD} fill="#fff" />
          <path d="M21 44l-2 8M30 44l-2 8M39 44l-2 8" />
        </g>
      )}

      {kind === 'snow' && (
        <g>
          <path d={CLOUD} fill="#fff" />
          <path d="M21 47v6M18 50h6M35 47v6M32 50h6" />
        </g>
      )}

      {kind === 'storm' && (
        <g>
          <path d={CLOUD} fill="#fff" />
          <path d="M31 43l-8 7h8l-3 6" />
        </g>
      )}
    </svg>
  )
}
