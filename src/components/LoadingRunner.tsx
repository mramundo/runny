import { RunnerMark } from './RunnerMark'

export function LoadingRunner({ message }: { message: string }) {
  return (
    <div className="panel flex items-center gap-4 px-5 py-6" role="status" aria-live="polite">
      <RunnerMark className="h-8 w-8 shrink-0 text-volt" running />
      <p className="label clip animate-blink text-chalk">{message}…</p>
    </div>
  )
}
