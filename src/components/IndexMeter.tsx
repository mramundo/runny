import { BAND_HEX } from '../lib/bands'
import { bandOf } from '../lib/score'

type Props = {
  score: number
  label: string
  ariaLabel: string
  /** `big` is the featured window; `inline` sits inside a compact card */
  size?: 'big' | 'inline'
}

const SEGMENTS = 20

/**
 * A segmented bar rather than a ring: it reads like an instrument, and the
 * number stays the loudest thing on the card.
 */
export function IndexMeter({ score, label, ariaLabel, size = 'inline' }: Props) {
  const clamped = Math.max(0, Math.min(100, score))
  const lit = Math.round((clamped / 100) * SEGMENTS)
  const colour = BAND_HEX[bandOf(clamped)]
  const big = size === 'big'

  return (
    <div className="w-full min-w-0" role="img" aria-label={`${ariaLabel}: ${score}`}>
      <div className="flex items-end justify-between gap-3">
        <span className="label">{label}</span>
        <span
          className={`num leading-none ${big ? 'text-5xl sm:text-6xl' : 'text-3xl'}`}
          style={{ color: colour }}
        >
          {score}
        </span>
      </div>
      <div className={`mt-2 flex gap-[3px] ${big ? 'h-3' : 'h-2'}`} aria-hidden="true">
        {Array.from({ length: SEGMENTS }, (_, i) => (
          <span
            key={i}
            className="flex-1 rounded-[1px]"
            style={{
              background: i < lit ? colour : 'var(--color-line-soft)',
              opacity: i < lit ? 1 - (i / SEGMENTS) * 0.25 : 1,
            }}
          />
        ))}
      </div>
    </div>
  )
}
