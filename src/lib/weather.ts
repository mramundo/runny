import { samplePolyline } from './geometry'
import { runnyScore } from './score'
import type { Forecast, HourPoint, LatLon } from './types'

const FORECAST = 'https://api.open-meteo.com/v1/forecast'

/** Points we ask the forecast about. Enough to catch a coast-to-hill run,
 *  few enough to stay one polite request. */
export const MAX_SAMPLES = 8
export const FORECAST_DAYS = 4

const HOURLY = [
  'temperature_2m',
  'relative_humidity_2m',
  'dew_point_2m',
  'apparent_temperature',
  'precipitation_probability',
  'precipitation',
  'weather_code',
  'cloud_cover',
  'wind_speed_10m',
  'wind_gusts_10m',
  'uv_index',
  'is_day',
] as const

type HourlyKey = (typeof HOURLY)[number]

type LocationForecast = {
  timezone?: string
  utc_offset_seconds?: number
  hourly?: Partial<Record<HourlyKey, (number | null)[]>> & { time?: string[] }
  daily?: { time?: string[]; sunrise?: string[]; sunset?: string[] }
}

export class WeatherError extends Error {}

const num = (v: number | null | undefined, fallback = 0) =>
  typeof v === 'number' && Number.isFinite(v) ? v : fallback

/** Mean of the same hour across every sampled point of the route. */
function averageAt(series: (number | null)[][], i: number, fallback = 0): number {
  let sum = 0
  let count = 0
  for (const s of series) {
    const v = s[i]
    if (typeof v === 'number' && Number.isFinite(v)) {
      sum += v
      count++
    }
  }
  return count ? sum / count : fallback
}

/** Worst condition anywhere on the route wins — you have to run through it. */
function worstAt(series: (number | null)[][], i: number): number {
  let worst = 0
  for (const s of series) {
    const v = s[i]
    if (typeof v === 'number' && v > worst) worst = v
  }
  return worst
}

function column(locs: LocationForecast[], key: HourlyKey): (number | null)[][] {
  return locs.map((l) => l.hourly?.[key] ?? [])
}

/**
 * Averaged hourly forecast for a whole route.
 * Open-Meteo accepts several coordinates in one call and answers with an
 * array, so an eight-point route still costs a single request.
 */
export async function forecastAlongRoute(
  points: [number, number][],
  signal?: AbortSignal,
): Promise<Forecast> {
  const samples: LatLon[] = samplePolyline(points, MAX_SAMPLES)
  if (samples.length === 0) throw new WeatherError('no sample points')

  const url = new URL(FORECAST)
  url.searchParams.set('latitude', samples.map((p) => p.lat.toFixed(4)).join(','))
  url.searchParams.set('longitude', samples.map((p) => p.lon.toFixed(4)).join(','))
  url.searchParams.set('hourly', HOURLY.join(','))
  url.searchParams.set('daily', 'sunrise,sunset')
  url.searchParams.set('timezone', 'auto')
  url.searchParams.set('forecast_days', String(FORECAST_DAYS))
  url.searchParams.set('wind_speed_unit', 'kmh')

  const res = await fetch(url, { signal })
  if (!res.ok) throw new WeatherError(`open-meteo ${res.status}`)
  const raw: LocationForecast | LocationForecast[] = await res.json()
  const locs = Array.isArray(raw) ? raw : [raw]
  const head = locs[0]
  const times = head?.hourly?.time ?? []
  if (times.length === 0) throw new WeatherError('open-meteo: empty series')

  const offsetMs = num(head.utc_offset_seconds) * 1000
  const cols = {
    temp: column(locs, 'temperature_2m'),
    humidity: column(locs, 'relative_humidity_2m'),
    dew: column(locs, 'dew_point_2m'),
    apparent: column(locs, 'apparent_temperature'),
    precipProb: column(locs, 'precipitation_probability'),
    precip: column(locs, 'precipitation'),
    code: column(locs, 'weather_code'),
    cloud: column(locs, 'cloud_cover'),
    wind: column(locs, 'wind_speed_10m'),
    gusts: column(locs, 'wind_gusts_10m'),
    uv: column(locs, 'uv_index'),
    isDay: column(locs, 'is_day'),
  }

  const hours: HourPoint[] = times.map((time, i) => {
    const temp = averageAt(cols.temp, i)
    const apparent = averageAt(cols.apparent, i, temp)
    const dewPoint = averageAt(cols.dew, i, temp - 5)
    const precipProb = averageAt(cols.precipProb, i)
    const precipMm = averageAt(cols.precip, i)
    const wind = averageAt(cols.wind, i)
    const gusts = averageAt(cols.gusts, i, wind)
    const uv = averageAt(cols.uv, i)
    const weatherCode = worstAt(cols.code, i)
    const isDay = averageAt(cols.isDay, i) >= 0.5

    return {
      time,
      // `time` is local wall clock; shift by the location's offset to get UTC.
      t: Date.parse(`${time}:00Z`) - offsetMs,
      temp,
      apparent,
      humidity: averageAt(cols.humidity, i),
      dewPoint,
      precipProb,
      precipMm,
      wind,
      gusts,
      uv,
      cloud: averageAt(cols.cloud, i),
      isDay,
      weatherCode,
      score: runnyScore({
        apparent,
        dewPoint,
        precipProb,
        precipMm,
        wind,
        gusts,
        uv,
        isDay,
        weatherCode,
      }),
    }
  })

  const dayTimes = head.daily?.time ?? []
  const days = dayTimes.map((date, i) => ({
    date,
    sunrise: head.daily?.sunrise?.[i] ?? '',
    sunset: head.daily?.sunset?.[i] ?? '',
  }))

  return {
    hours,
    timezone: head.timezone ?? 'UTC',
    days,
    sampleCount: samples.length,
  }
}
