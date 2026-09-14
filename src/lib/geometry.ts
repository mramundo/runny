import type { LatLon } from './types'

export const EARTH_R = 6_371_008.8

const toRad = (d: number) => (d * Math.PI) / 180
const toDeg = (r: number) => (r * 180) / Math.PI

/** Great-circle distance in metres. */
export function haversine(a: LatLon, b: LatLon): number {
  const dLat = toRad(b.lat - a.lat)
  const dLon = toRad(b.lon - a.lon)
  const la1 = toRad(a.lat)
  const la2 = toRad(b.lat)
  const h =
    Math.sin(dLat / 2) ** 2 + Math.cos(la1) * Math.cos(la2) * Math.sin(dLon / 2) ** 2
  return 2 * EARTH_R * Math.asin(Math.min(1, Math.sqrt(h)))
}

/** Point reached from `origin` travelling `meters` along `bearingDeg` (clockwise from north). */
export function destination(origin: LatLon, bearingDeg: number, meters: number): LatLon {
  const d = meters / EARTH_R
  const br = toRad(bearingDeg)
  const la1 = toRad(origin.lat)
  const lo1 = toRad(origin.lon)
  const la2 = Math.asin(Math.sin(la1) * Math.cos(d) + Math.cos(la1) * Math.sin(d) * Math.cos(br))
  const lo2 =
    lo1 +
    Math.atan2(
      Math.sin(br) * Math.sin(d) * Math.cos(la1),
      Math.cos(d) - Math.sin(la1) * Math.sin(la2),
    )
  return { lat: toDeg(la2), lon: ((toDeg(lo2) + 540) % 360) - 180 }
}

/** Initial bearing from `a` to `b`, degrees clockwise from north, 0–360. */
export function bearing(a: LatLon, b: LatLon): number {
  const la1 = toRad(a.lat)
  const la2 = toRad(b.lat)
  const dLon = toRad(b.lon - a.lon)
  const y = Math.sin(dLon) * Math.cos(la2)
  const x = Math.cos(la1) * Math.sin(la2) - Math.sin(la1) * Math.cos(la2) * Math.cos(dLon)
  return (toDeg(Math.atan2(y, x)) + 360) % 360
}

const COMPASS = ['n', 'ne', 'e', 'se', 's', 'sw', 'w', 'nw'] as const

export function compassOf(bearingDeg: number): (typeof COMPASS)[number] {
  const i = Math.round((((bearingDeg % 360) + 360) % 360) / 45) % 8
  return COMPASS[i]
}

/** Total length in metres of a [lat, lon] polyline. */
export function polylineLength(points: [number, number][]): number {
  let total = 0
  for (let i = 1; i < points.length; i++) {
    total += haversine(
      { lat: points[i - 1][0], lon: points[i - 1][1] },
      { lat: points[i][0], lon: points[i][1] },
    )
  }
  return total
}

/**
 * Evenly spaced samples along a polyline, always including both ends.
 * Used to pick the handful of coordinates we ask the forecast about.
 */
export function samplePolyline(points: [number, number][], count: number): LatLon[] {
  if (points.length === 0) return []
  const n = Math.max(2, Math.min(count, points.length))
  if (points.length <= n) return points.map(([lat, lon]) => ({ lat, lon }))

  // Cumulative distance so samples are spaced by length, not by vertex index —
  // routed polylines bunch vertices at junctions and thin them on long straights.
  const cum: number[] = [0]
  for (let i = 1; i < points.length; i++) {
    cum.push(
      cum[i - 1] +
        haversine(
          { lat: points[i - 1][0], lon: points[i - 1][1] },
          { lat: points[i][0], lon: points[i][1] },
        ),
    )
  }
  const total = cum[cum.length - 1]
  if (total === 0) return [{ lat: points[0][0], lon: points[0][1] }]

  const out: LatLon[] = []
  let cursor = 0
  for (let s = 0; s < n; s++) {
    const target = (total * s) / (n - 1)
    // Advance to the vertex whose cumulative distance is nearest the target,
    // so the last sample is genuinely the last vertex.
    while (
      cursor < cum.length - 1 &&
      Math.abs(cum[cursor + 1] - target) <= Math.abs(cum[cursor] - target)
    ) {
      cursor++
    }
    const [lat, lon] = points[cursor]
    out.push({ lat, lon })
  }
  return out
}

/** Sum of positive elevation deltas, ignoring sub-metre sensor noise. */
export function ascentOf(elevations: number[], noiseFloor = 1): number {
  let gain = 0
  for (let i = 1; i < elevations.length; i++) {
    const d = elevations[i] - elevations[i - 1]
    if (d > noiseFloor) gain += d
  }
  return gain
}

/**
 * Google/Valhalla encoded polyline decoder.
 * Valhalla answers with precision 6; Google's own format is precision 5.
 */
export function decodePolyline(encoded: string, precision = 6): [number, number][] {
  const factor = 10 ** precision
  const out: [number, number][] = []
  let index = 0
  let lat = 0
  let lon = 0

  while (index < encoded.length) {
    let result = 0
    let shift = 0
    let byte: number
    do {
      byte = encoded.charCodeAt(index++) - 63
      result |= (byte & 0x1f) << shift
      shift += 5
    } while (byte >= 0x20)
    lat += result & 1 ? ~(result >> 1) : result >> 1

    result = 0
    shift = 0
    do {
      byte = encoded.charCodeAt(index++) - 63
      result |= (byte & 0x1f) << shift
      shift += 5
    } while (byte >= 0x20)
    lon += result & 1 ? ~(result >> 1) : result >> 1

    out.push([lat / factor, lon / factor])
  }
  return out
}

/**
 * Shifts a polyline sideways, to the right of travel, by a fixed distance.
 * A route that runs up a street and back down it draws as one line on top of
 * itself; offsetting each direction turns it into two parallel lines, which is
 * the only way an out-and-back is readable on a map.
 */
export function offsetPolyline(points: [number, number][], meters: number): [number, number][] {
  if (points.length < 2 || meters === 0) return points

  const out: [number, number][] = []
  for (let i = 0; i < points.length; i++) {
    const here = { lat: points[i][0], lon: points[i][1] }
    const prev = i > 0 ? { lat: points[i - 1][0], lon: points[i - 1][1] } : null
    const next = i < points.length - 1 ? { lat: points[i + 1][0], lon: points[i + 1][1] } : null

    // A vertex belongs to two segments; take the average heading so the shifted
    // line turns corners instead of breaking apart at them.
    const headings: number[] = []
    if (prev) headings.push(bearing(prev, here))
    if (next) headings.push(bearing(here, next))
    const heading = averageAngle(headings)

    const shifted = destination(here, (heading + 90) % 360, meters)
    out.push([shifted.lat, shifted.lon])
  }
  return out
}

/** Mean of angles in degrees, taken through their unit vectors so 350 and 10 average to 0. */
function averageAngle(degrees: number[]): number {
  if (degrees.length === 0) return 0
  if (degrees.length === 1) return degrees[0]
  let x = 0
  let y = 0
  for (const d of degrees) {
    x += Math.cos(toRad(d))
    y += Math.sin(toRad(d))
  }
  return (toDeg(Math.atan2(y, x)) + 360) % 360
}

/** Bounding box of a polyline as [[south, west], [north, east]]. */
export function boundsOf(points: [number, number][]): [[number, number], [number, number]] {
  let s = 90
  let w = 180
  let n = -90
  let e = -180
  for (const [lat, lon] of points) {
    if (lat < s) s = lat
    if (lat > n) n = lat
    if (lon < w) w = lon
    if (lon > e) e = lon
  }
  return [
    [s, w],
    [n, e],
  ]
}
