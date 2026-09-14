import type { Lang, LatLon, Place } from '../lib/types'
import type { Strings } from '../lib/i18n'
import { PlaceInput } from './PlaceInput'
import { SectionHead } from './SectionHead'

type Props = {
  strings: Strings
  lang: Lang
  start: Place | null
  onStart: (p: Place | null) => void
  onGps: () => void
  gpsBusy: boolean
  onSearchError: (message: string) => void
}

/**
 * The starting point stands on its own, above the rest: everything further
 * down — a finish, a suggested loop — is built from it, so asking for it once
 * and separately keeps the two paths from looking like rivals.
 */
export function StartCard({ strings, lang, start, onStart, onGps, gpsBusy, onSearchError }: Props) {
  return (
    <section className="panel tick">
      <SectionHead
        kicker={strings.start.kicker}
        title={strings.start.title}
        action={
          <button type="button" onClick={onGps} disabled={gpsBusy} className="btn btn-line px-4 py-2.5">
            <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
              <circle cx="12" cy="12" r="3" />
              <circle cx="12" cy="12" r="8" />
              <path d="M12 1.5v3M12 19.5v3M1.5 12h3M19.5 12h3" strokeLinecap="round" />
            </svg>
            {gpsBusy ? strings.start.locating : strings.start.useGps}
          </button>
        }
      />

      <div className="mt-6">
        <PlaceInput
          label={strings.start.title}
          hideLabel
          placeholder={strings.start.placeholder}
          value={start}
          onChange={onStart}
          lang={lang}
          near={start ? ({ lat: start.lat, lon: start.lon } satisfies LatLon) : null}
          accent="volt"
          onError={onSearchError}
          strings={{
            searching: strings.start.searching,
            noResults: strings.start.noResults,
            clear: strings.start.clear,
          }}
        />
      </div>

      <p className="label mt-3">{start ? `✓ ${strings.start.ready}` : strings.start.hint}</p>
    </section>
  )
}
