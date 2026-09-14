import type { Lang, LatLon, Place } from './types'

const LANG_KEY = 'runny:lang'

/* ============================================================
   Language: Italian inside Italy, English everywhere else.
   ============================================================ */

export function storedLang(): Lang | null {
  try {
    const v = localStorage.getItem(LANG_KEY)
    return v === 'it' || v === 'en' ? v : null
  } catch {
    return null
  }
}

export function storeLang(lang: Lang) {
  try {
    localStorage.setItem(LANG_KEY, lang)
  } catch {
    /* private mode — the session still works, it just won't remember */
  }
}

/**
 * Instant, offline guess so the first paint is never blank or wrong-ish for
 * the common case. `detectCountryLang` refines it once the network answers.
 */
export function guessLang(): Lang {
  const forced = new URLSearchParams(location.search).get('lang')
  if (forced === 'it' || forced === 'en') return forced

  const saved = storedLang()
  if (saved) return saved

  try {
    if (Intl.DateTimeFormat().resolvedOptions().timeZone === 'Europe/Rome') return 'it'
  } catch {
    /* ignore */
  }

  const nav = (navigator.languages && navigator.languages[0]) || navigator.language || 'en'
  return nav.toLowerCase().startsWith('it') ? 'it' : 'en'
}

/** ISO-3166 alpha-2 of where the request comes from, or null if unknown. */
export async function detectCountry(signal?: AbortSignal): Promise<string | null> {
  try {
    const res = await fetch('https://ipwho.is/?fields=country_code', { signal })
    if (!res.ok) return null
    const data: { country_code?: string } = await res.json()
    return data.country_code ? data.country_code.toUpperCase() : null
  } catch {
    return null
  }
}

/** Country -> language, with the user's explicit choice always winning. */
export async function detectCountryLang(signal?: AbortSignal): Promise<Lang | null> {
  const country = await detectCountry(signal)
  if (!country) return null
  return country === 'IT' ? 'it' : 'en'
}

/* ============================================================
   Device position
   ============================================================ */

export type GeoFailure = 'unsupported' | 'denied' | 'failed'

export function currentPosition(): Promise<LatLon> {
  return new Promise((resolve, reject) => {
    if (!('geolocation' in navigator)) {
      reject('unsupported' satisfies GeoFailure)
      return
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => resolve({ lat: pos.coords.latitude, lon: pos.coords.longitude }),
      (err) => reject((err.code === err.PERMISSION_DENIED ? 'denied' : 'failed') satisfies GeoFailure),
      { enableHighAccuracy: true, timeout: 12_000, maximumAge: 120_000 },
    )
  })
}

type BigDataCloudReverse = {
  city?: string
  locality?: string
  principalSubdivision?: string
  countryName?: string
  countryCode?: string
}

/** Turns raw coordinates into something a human recognises on a card. */
export async function reverseGeocode(
  at: LatLon,
  lang: Lang,
  fallbackName: string,
  signal?: AbortSignal,
): Promise<Place> {
  const base: Place = {
    ...at,
    id: `gps:${at.lat.toFixed(5)},${at.lon.toFixed(5)}`,
    name: fallbackName,
    detail: `${at.lat.toFixed(4)}, ${at.lon.toFixed(4)}`,
  }
  try {
    const url = new URL('https://api.bigdatacloud.net/data/reverse-geocode-client')
    url.searchParams.set('latitude', String(at.lat))
    url.searchParams.set('longitude', String(at.lon))
    url.searchParams.set('localityLanguage', lang)
    const res = await fetch(url, { signal })
    if (!res.ok) return base
    const d: BigDataCloudReverse = await res.json()
    const name = d.locality || d.city || fallbackName
    const detail = [d.city && d.city !== name ? d.city : null, d.principalSubdivision, d.countryName]
      .filter(Boolean)
      .join(', ')
    return { ...base, name, detail: detail || base.detail }
  } catch {
    return base
  }
}

/* ============================================================
   Place search (Photon, the OSM-backed geocoder)
   ============================================================ */

type PhotonFeature = {
  geometry: { coordinates: [number, number] }
  properties: {
    osm_id?: number
    osm_type?: string
    name?: string
    street?: string
    housenumber?: string
    city?: string
    district?: string
    county?: string
    state?: string
    country?: string
    postcode?: string
  }
}

function toPlace(f: PhotonFeature, i: number): Place {
  const p = f.properties
  const [lon, lat] = f.geometry.coordinates
  const street = p.street ? [p.street, p.housenumber].filter(Boolean).join(' ') : null
  const name = p.name || street || p.city || p.county || p.state || 'Unnamed place'
  const detail = [
    street && street !== name ? street : null,
    p.district && p.district !== name ? p.district : null,
    p.city && p.city !== name ? p.city : null,
    p.state,
    p.country,
  ]
    .filter(Boolean)
    .join(', ')
  return {
    lat,
    lon,
    name,
    detail,
    id: `${p.osm_type ?? 'x'}${p.osm_id ?? i}:${lat.toFixed(5)},${lon.toFixed(5)}`,
  }
}

/**
 * Autocomplete. `near` biases results towards the runner instead of towards
 * the largest city on the planet with a similar name.
 */
export async function searchPlaces(
  query: string,
  lang: Lang,
  near: LatLon | null,
  signal?: AbortSignal,
): Promise<Place[]> {
  const q = query.trim()
  if (q.length < 2) return []

  const url = new URL('https://photon.komoot.io/api/')
  url.searchParams.set('q', q)
  url.searchParams.set('limit', '6')
  // Photon speaks default/de/en/fr only. 'default' returns each place's own
  // local name, which is the right answer for an Italian-speaking runner.
  url.searchParams.set('lang', lang === 'it' ? 'default' : 'en')
  if (near) {
    url.searchParams.set('lat', String(near.lat))
    url.searchParams.set('lon', String(near.lon))
  }

  const res = await fetch(url, { signal })
  if (!res.ok) throw new Error(`photon ${res.status}`)
  const data: { features?: PhotonFeature[] } = await res.json()
  const seen = new Set<string>()
  return (data.features ?? [])
    .map(toPlace)
    .filter((p) => {
      const key = `${p.name}|${p.detail}`
      if (seen.has(key)) return false
      seen.add(key)
      return true
    })
}
