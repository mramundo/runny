import { BAND_HEX } from '../lib/bands'
import { bandOf } from '../lib/score'

type Props = {
  score: number
  ariaLabel: string
  size?: 'big' | 'inline'
  className?: string
}

const SEGMENTS = 20

/**
 * The index as a bar and nothing else. The figure and the band name live in
 * the card's own header, so the bar does not repeat them underneath.
 */
export function IndexBar({ score, ariaLabel, size = 'inline', className }: Props) {
  const clamped = Math.max(0, Math.min(100, score))
  const lit = Math.round((clamped / 100) * SEGMENTS)
  const colour = BAND_HEX[bandOf(clamped)]

  return (
    <div
      role="img"
      aria-label={`${ariaLabel}: ${score}`}
      className={`flex gap-[3px] ${size === 'big' ? 'h-2.5' : 'h-1.5'} ${className ?? ''}`}
    >
      {Array.from({ length: SEGMENTS }, (_, i) => (
        <span
          key={i}
          className="flex-1 rounded-[1px]"
          style={{ background: i < lit ? colour : 'var(--color-line-soft)' }}
        />
      ))}
    </div>
  )
}
