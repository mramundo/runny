import { pace as formatPace } from '../lib/format'
import { MAX_PACE, MIN_PACE } from '../lib/distances'
import type { Lang, LatLon, Place, Suggestion } from '../lib/types'
import type { Strings } from '../lib/i18n'
import { DistanceGrid } from './DistanceGrid'
import { PlaceInput } from './PlaceInput'
import { SectionHead } from './SectionHead'
import { SuggestionList } from './SuggestionList'

type Props = {
  strings: Strings
  lang: Lang
  hasStart: boolean
  start: Place | null
  end: Place | null
  onEnd: (p: Place | null) => void
  loop: boolean
  onLoop: (v: boolean) => void
  pace: number
  onPace: (v: number) => void
  selectedKm: number | null
  onSelectKm: (km: number) => void
  suggestions: Suggestion[]
  suggestBusy: boolean
  suggestFailed: boolean
  activeId: string | null
  onPickSuggestion: (s: Suggestion) => void
  onSubmit: () => void
  submitting: boolean
  onSearchError: (message: string) => void
}

/**
 * One panel, two ways to describe the same run: come back to the start, or
 * end somewhere else. The tabs make them alternatives rather than two
 * competing forms stacked on the page.
 */
export function RunSetup({
  strings,
  lang,
  hasStart,
  start,
  end,
  onEnd,
  loop,
  onLoop,
  pace,
  onPace,
  selectedKm,
  onSelectKm,
  suggestions,
  suggestBusy,
  suggestFailed,
  activeId,
  onPickSuggestion,
  onSubmit,
  submitting,
  onSearchError,
}: Props) {
  const near = start ? ({ lat: start.lat, lon: start.lon } satisfies LatLon) : null

  return (
    <section className="panel tick tick-ice">
      <SectionHead kicker={strings.mode.kicker} title={strings.mode.title} />

      <div className="tabs mt-6" role="tablist">
        <button
          type="button"
          role="tab"
          aria-selected={loop}
          className="tab"
          onClick={() => onLoop(true)}
        >
          {strings.mode.loopTab}
        </button>
        <button
          type="button"
          role="tab"
          aria-selected={!loop}
          className="tab"
          onClick={() => onLoop(false)}
        >
          {strings.mode.abTab}
        </button>
      </div>

      <div className={hasStart ? 'mt-6' : 'mt-6 pointer-events-none opacity-40'}>
        <p className="clip text-[0.95rem] leading-relaxed text-muted">
          {loop ? strings.mode.loopLead : strings.mode.abLead}
        </p>

        {loop ? (
          <div className="mt-5">
            <DistanceGrid lang={lang} selected={selectedKm} disabled={!hasStart || suggestBusy} onSelect={onSelectKm} />

            {suggestBusy && <p className="label animate-blink mt-5 text-volt">{strings.suggest.building}…</p>}
            {!suggestBusy && suggestFailed && (
              <p className="clip mt-5 text-sm text-flare">{strings.suggest.failed}</p>
            )}
            {!suggestBusy && suggestions.length > 0 && (
              <div className="mt-5">
                <SuggestionList
                  strings={strings}
                  lang={lang}
                  suggestions={suggestions}
                  pace={pace}
                  activeId={activeId}
                  onPick={onPickSuggestion}
                />
              </div>
            )}
          </div>
        ) : (
          <div className="mt-5">
            <PlaceInput
              label={strings.mode.endLabel}
              placeholder={strings.mode.endPlaceholder}
              value={end}
              onChange={onEnd}
              lang={lang}
              near={near}
              accent="ice"
              onError={onSearchError}
              strings={{
                searching: strings.start.searching,
                noResults: strings.start.noResults,
                clear: strings.start.clear,
              }}
            />

            <button
              type="button"
              onClick={onSubmit}
              disabled={!hasStart || !end || submitting}
              className="btn btn-solid mt-6 w-full px-6 py-4 text-sm"
            >
              {submitting ? `${strings.mode.submitting}…` : strings.mode.submit}
            </button>
          </div>
        )}
      </div>

      {!hasStart && <p className="label mt-4 text-flare">{strings.mode.needStart}</p>}

      <div className="hairline mt-7 pt-5">
        <div className="flex flex-wrap items-end justify-between gap-2">
          <label htmlFor="pace" className="label">
            {strings.mode.paceLabel}
          </label>
          <span className="num text-2xl leading-none text-volt">
            {formatPace(pace)}
            <span className="ml-1.5 font-mono text-[0.66rem] font-medium tracking-[0.12em] text-faint">
              {strings.mode.paceUnit}
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
        <p className="clip font-mono text-[0.68rem] text-faint">{strings.mode.paceHint}</p>
      </div>
    </section>
  )
}
