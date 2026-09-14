export type LatLon = { lat: number; lon: number }

export type Place = LatLon & {
  /** Short display name, e.g. "Villa Borghese" */
  name: string
  /** Qualifier under the name, e.g. "Rome, Lazio, Italy" */
  detail: string
  /** Stable key for React lists + dedupe */
  id: string
}

export type RouteShape = {
  /** Decoded polyline, [lat, lon] pairs, in travel order */
  points: [number, number][]
  /** Total length in metres */
  meters: number
  /** Valhalla's own pedestrian time estimate, seconds (we re-estimate from pace) */
  seconds: number
}

export type RoutePlan = RouteShape & {
  kind: 'point-to-point' | 'loop' | 'out-and-back'
  start: Place
  end: Place
  /** Cumulative ascent in metres, when elevation lookup succeeded */
  ascent?: number
  /** Sampled elevation profile, metres above sea level */
  elevation?: number[]
}

export type Suggestion = RoutePlan & {
  id: string
  /** Target distance the loop was generated for, in km */
  targetKm: number
  /** Human label, e.g. "North loop" */
  bearingLabel: BearingLabel
}

export type BearingLabel = 'n' | 'ne' | 'e' | 'se' | 's' | 'sw' | 'w' | 'nw'

/** One hour of averaged forecast across every sampled point of the route. */
export type HourPoint = {
  /** Local wall-clock time at the route, ISO without zone (Open-Meteo `timezone=auto`) */
  time: string
  /** Epoch ms, interpreted in the route's local timezone offset */
  t: number
  temp: number
  apparent: number
  humidity: number
  dewPoint: number
  precipProb: number
  precipMm: number
  wind: number
  gusts: number
  uv: number
  cloud: number
  isDay: boolean
  weatherCode: number
  /** 0-100 Runny Score for this single hour */
  score: number
}

export type Forecast = {
  hours: HourPoint[]
  /** IANA zone reported by Open-Meteo for the route's first sample */
  timezone: string
  /** Per-day sunrise/sunset in local wall-clock ISO */
  days: { date: string; sunrise: string; sunset: string }[]
  /** How many points along the route were averaged */
  sampleCount: number
}

/** A contiguous stretch of hours long enough to fit the run. */
export type RunWindow = {
  startIso: string
  endIso: string
  startT: number
  endT: number
  /** Mean Runny Score across the window */
  score: number
  /** Averages across the window, for the card */
  apparent: number
  temp: number
  humidity: number
  precipProb: number
  wind: number
  uv: number
  weatherCode: number
  isDay: boolean
  /** Local day key (YYYY-MM-DD) the window starts on */
  day: string
}

export type Band = 'perfect' | 'great' | 'ok' | 'poor' | 'bad'

export type Lang = 'it' | 'en'

export type Units = 'metric'

export type AppError = {
  kind: 'geo' | 'search' | 'route' | 'weather' | 'generic'
  message: string
}
