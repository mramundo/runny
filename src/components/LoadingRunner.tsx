import { RunnerMark } from './RunnerMark'

export function LoadingRunner({ message }: { message: string }) {
  return (
    <div className="flex flex-col items-center gap-4 py-10" role="status" aria-live="polite">
      <span className="grid h-20 w-20 place-items-center rounded-[1.1rem] border-4 border-ink bg-volt-400 shadow-pop-sm">
        <RunnerMark className="h-12 w-12 text-ink" running />
      </span>
      <p className="font-display text-center text-lg font-extrabold">{message}</p>
    </div>
  )
}
