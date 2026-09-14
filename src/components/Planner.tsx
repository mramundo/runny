import { pace as formatPace } from '../lib/format'
import { MAX_PACE, MIN_PACE } from '../lib/distances'
import type { Lang, LatLon, Place } from '../lib/types'
import type { Strings } from '../lib/i18n'
import { PlaceInput } from './PlaceInput'
import { SectionHead } from './SectionHead'

type Props = {
  strings: Strings
  lang: Lang
  start: Place | null
  end: Place | null
  onStart: (p: Place | null) => void
  onEnd: (p: Place | null) => void
  loop: boolean
  onLoop: (v: boolean) => void
  pace: number
  onPace: (v: number) => void
  onGps: () => void
  gpsBusy: boolean
  onSubmit: () => void
  submitting: boolean
  onSearchError: (message: string) => void
}

export function Planner({
  strings,
  lang,
  start,
  end,
  onStart,
  onEnd,
  loop,
  onLoop,
  pace,
  onPace,
  onGps,
  gpsBusy,
  onSubmit,
  submitting,
  onSearchError,
}: Props) {
  const ready = Boolean(start) && (loop || Boolean(end))
  const inputStrings = {
    searching: strings.planner.searching,
    noResults: strings.planner.noResults,
    clear: strings.planner.clear,
  }

  function swap() {
    const a = start
    onStart(end)
    onEnd(a)
  }

  return (
    <section id="planner" className="panel tick p-5 sm:p-7">
      <SectionHead
        kicker={strings.planner.kicker}
        title={strings.planner.title}
        action={
          <button type="button" onClick={onGps} disabled={gpsBusy} className="btn btn-line px-4 py-2.5">
            <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
              <circle cx="12" cy="12" r="3" />
              <circle cx="12" cy="12" r="8" />
              <path d="M12 1.5v3M12 19.5v3M1.5 12h3M19.5 12h3" strokeLinecap="round" />
            </svg>
            {gpsBusy ? strings.planner.locating : strings.planner.useGps}
          </button>
        }
      />

      <div className="mt-7 grid gap-6 sm:grid-cols-2">
        <PlaceInput
          label={strings.planner.startLabel}
          placeholder={strings.planner.startPlaceholder}
          value={start}
          onChange={onStart}
          lang={lang}
          near={start ? ({ lat: start.lat, lon: start.lon } satisfies LatLon) : null}
          accent="volt"
          onError={onSearchError}
          strings={inputStrings}
        />

        <div className={loop ? 'pointer-events-none opacity-35' : undefined}>
          <PlaceInput
            label={strings.planner.endLabel}
            placeholder={strings.planner.endPlaceholder}
            value={loop ? start : end}
            onChange={onEnd}
            lang={lang}
            near={start ? ({ lat: start.lat, lon: start.lon } satisfies LatLon) : null}
            accent="ice"
            disabled={loop}
            onError={onSearchError}
            strings={inputStrings}
          />
        </div>
      </div>

      <div className="mt-6 flex flex-wrap items-center gap-x-6 gap-y-3">
        <label className="flex cursor-pointer items-center gap-3">
          <input type="checkbox" className="sr-only" checked={loop} onChange={(e) => onLoop(e.target.checked)} />
          <span className="switch" data-on={loop} aria-hidden="true" />
          <span className="clip text-sm font-semibold">{strings.planner.loopToggle}</span>
        </label>

        {!loop && (
          <button type="button" onClick={swap} className="label transition-colors hover:text-volt">
            ⇄ {strings.planner.swap}
          </button>
        )}
      </div>

      {loop && <p className="clip mt-2 font-mono text-[0.68rem] text-faint">{strings.planner.loopHint}</p>}

      <div className="hairline mt-7 pt-5">
        <div className="flex flex-wrap items-end justify-between gap-2">
          <label htmlFor="pace" className="label">
            {strings.planner.paceLabel}
          </label>
          <span className="num text-2xl leading-none text-volt">
            {formatPace(pace)}
            <span className="ml-1.5 font-mono text-[0.66rem] font-medium tracking-[0.12em] text-faint">
              {strings.planner.paceUnit}
            </span>
          </span>
        </div>
        <input
          id="pace"
          type="range"
          className="range mt-3"
          min={MIN_PACE}
          max={MAX_PACE}
          step={0.25}
          value={pace}
          onChange={(e) => onPace(Number(e.target.value))}
        />
        <p className="clip font-mono text-[0.68rem] text-faint">{strings.planner.paceHint}</p>
      </div>

      <button
        type="button"
        onClick={onSubmit}
        disabled={!ready || submitting}
        className="btn btn-solid mt-7 w-full px-6 py-4 text-sm"
      >
        {submitting ? `${strings.planner.submitting}…` : strings.planner.submit}
      </button>
    </section>
  )
}
