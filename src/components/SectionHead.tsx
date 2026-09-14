import type { ReactNode } from 'react'

type Props = { kicker: string; title: string; action?: ReactNode }

/** The one heading shape every panel uses: mono kicker, display title. */
export function SectionHead({ kicker, title, action }: Props) {
  return (
    <div className="flex flex-wrap items-start justify-between gap-x-6 gap-y-3">
      <div className="min-w-0">
        <p className="label">{kicker}</p>
        <h2 className="h-display clip mt-2 text-[clamp(1.5rem,4.6vw,2.2rem)]">{title}</h2>
      </div>
      {action && <div className="shrink-0">{action}</div>}
    </div>
  )
}
