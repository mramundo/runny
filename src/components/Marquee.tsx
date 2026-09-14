type Props = { items: string[]; speed?: number; className?: string }

/** Endless ticker strip. The list is doubled so the loop never shows a seam. */
export function Marquee({ items, speed = 28, className }: Props) {
  const run = [...items, ...items]
  return (
    <div
      className={`overflow-hidden border-y-4 border-ink py-2 ${className ?? ''}`}
      aria-hidden="true"
    >
      <div className="marquee-track" style={{ '--speed': `${speed}s` } as React.CSSProperties}>
        {run.map((item, i) => (
          <span
            key={i}
            className="font-display px-5 text-sm font-black tracking-[0.18em] uppercase whitespace-nowrap sm:text-base"
          >
            {item}
            <span className="ml-5 text-cool-500">●</span>
          </span>
        ))}
      </div>
    </div>
  )
}
