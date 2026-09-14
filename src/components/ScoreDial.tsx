import { BAND_HEX } from '../lib/bands'
import { bandOf } from '../lib/score'

type Props = {
  score: number
  label: string
  ariaLabel: string
  size?: number
  className?: string
}

const R = 42
const CIRC = 2 * Math.PI * R

/** Ring gauge: ink track, band-coloured arc, the number doing the shouting. */
export function ScoreDial({ score, label, ariaLabel, size = 132, className }: Props) {
  const band = bandOf(score)
  const dash = (Math.max(0, Math.min(100, score)) / 100) * CIRC

  return (
    <div className={`relative shrink-0 ${className ?? ''}`} style={{ width: size, height: size }}>
      <svg viewBox="0 0 100 100" className="h-full w-full -rotate-90" role="img" aria-label={`${ariaLabel}: ${score}`}>
        <circle cx="50" cy="50" r={R} fill="none" stroke="#12161c" strokeWidth="13" opacity="0.1" />
        <circle
          className="score-arc"
          cx="50"
          cy="50"
          r={R}
          fill="none"
          stroke={BAND_HEX[band]}
          strokeWidth="13"
          strokeLinecap="round"
          strokeDasharray={`${dash} ${CIRC}`}
          style={{ ['--dash-from' as string]: `${CIRC}` }}
        />
        <circle cx="50" cy="50" r={R + 6.5} fill="none" stroke="#12161c" strokeWidth="3" />
        <circle cx="50" cy="50" r={R - 6.5} fill="none" stroke="#12161c" strokeWidth="3" />
      </svg>
      <div className="pointer-events-none absolute inset-0 grid place-items-center text-center">
        <div>
          <div className="font-display text-4xl leading-none font-black tabular-nums">{score}</div>
          <div className="mt-1 text-[0.6rem] leading-tight font-extrabold tracking-[0.12em] uppercase text-ink-soft">
            {label}
          </div>
        </div>
      </div>
    </div>
  )
}
