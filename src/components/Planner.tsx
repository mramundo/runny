import { pace as formatPace } from '../lib/format'
import { MAX_PACE, MIN_PACE } from '../lib/distances'
import type { Lang, LatLon, Place } from '../lib/types'
import type { Strings } from '../lib/i18n'
import { PlaceInput } from './PlaceInput'

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
    <section id="planner" className="card p-5 sm:p-7">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <span className="sticker bg-volt-400 px-3 py-1 text-[0.62rem]">{strings.planner.kicker}</span>
          <h2 className="font-display mt-3 text-2xl leading-none font-black sm:text-3xl">
            {strings.planner.title}
          </h2>
        </div>
        <button
          type="button"
          onClick={onGps}
          disabled={gpsBusy}
          className="btn-pop bg-cool-300 px-4 py-2.5 text-sm"
        >
          <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2.6" aria-hidden="true">
            <circle cx="12" cy="12" r="3.2" />
            <circle cx="12" cy="12" r="8" />
            <path d="M12 1.5v3M12 19.5v3M1.5 12h3M19.5 12h3" strokeLinecap="round" />
          </svg>
          {gpsBusy ? strings.planner.locating : strings.planner.useGps}
        </button>
      </div>

      <div className="mt-6 grid gap-4 sm:grid-cols-2">
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

        <div className={loop ? 'pointer-events-none opacity-45' : undefined}>
          <PlaceInput
            label={strings.planner.endLabel}
            placeholder={strings.planner.endPlaceholder}
            value={loop ? start : end}
            onChange={onEnd}
            lang={lang}
            near={start ? ({ lat: start.lat, lon: start.lon } satisfies LatLon) : null}
            accent="cool"
            disabled={loop}
            onError={onSearchError}
            strings={inputStrings}
          />
        </div>
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-3">
        <label className="flex cursor-pointer items-center gap-3 rounded-full border-[3px] border-ink bg-white px-4 py-2.5 shadow-pop-xs">
          <input
            type="checkbox"
            className="sr-only"
            checked={loop}
            onChange={(e) => onLoop(e.target.checked)}
          />
          <span
            className={`relative h-5 w-9 rounded-full border-[2.5px] border-ink transition ${
              loop ? 'bg-volt-400' : 'bg-paper-dim'
            }`}
          >
            <span
              className={`absolute top-[1px] h-[13px] w-[13px] rounded-full border-2 border-ink bg-white transition-all ${
                loop ? 'left-[17px]' : 'left-[1px]'
              }`}
            />
          </span>
          <span className="text-sm font-extrabold">{strings.planner.loopToggle}</span>
        </label>

        {!loop && (
          <button type="button" onClick={swap} className="btn-pop bg-white px-4 py-2.5 text-sm">
            <span aria-hidden="true">⇄</span>
            {strings.planner.swap}
          </button>
        )}
      </div>

      {loop && <p className="mt-2 pl-1 text-xs font-semibold text-ink-soft">{strings.planner.loopHint}</p>}

      <div className="mt-6 rounded-[1.1rem] border-[3px] border-ink bg-paper p-4">
        <div className="flex flex-wrap items-baseline justify-between gap-2">
          <label htmlFor="pace" className="font-display text-xs font-black tracking-[0.14em] uppercase">
            {strings.planner.paceLabel}
          </label>
          <span className="font-display text-2xl leading-none font-black tabular-nums">
            {formatPace(pace)}
            <span className="ml-1 text-xs font-extrabold text-ink-soft">{strings.planner.paceUnit}</span>
          </span>
        </div>
        <input
          id="pace"
          type="range"
          min={MIN_PACE}
          max={MAX_PACE}
          step={0.25}
          value={pace}
          onChange={(e) => onPace(Number(e.target.value))}
          className="mt-3 h-3 w-full cursor-pointer appearance-none rounded-full border-[2.5px] border-ink bg-gradient-to-r from-volt-400 to-cool-300 accent-ink"
        />
        <p className="mt-2 text-xs font-semibold text-ink-soft">{strings.planner.paceHint}</p>
      </div>

      <button
        type="button"
        onClick={onSubmit}
        disabled={!ready || submitting}
        className="btn-pop mt-6 w-full bg-volt-400 px-6 py-4 text-lg"
      >
        {submitting ? strings.planner.submitting : strings.planner.submit}
      </button>
    </section>
  )
}
