import { ascentOf, compassOf, decodePolyline, destination, samplePolyline } from './geometry'
import type { LatLon, Place, RoutePlan, RouteShape, Suggestion } from './types'

const VALHALLA = 'https://valhalla1.openstreetmap.de/route'
const ELEVATION = 'https://api.open-meteo.com/v1/elevation'

/**
 * The routing endpoint is a free community instance. Every call goes through
 * one queue with a gap between requests so a batch of loop attempts never
 * looks like a burst.
 */
const MIN_GAP_MS = 350
let chain: Promise<unknown> = Promise.resolve()

function queued<T>(job: () => Promise<T>): Promise<T> {
  const run = chain.then(async () => {
    const result = await job()
    await new Promise((r) => setTimeout(r, MIN_GAP_MS))
    return result
  })
  // Keep the chain alive even when a link rejects.
  chain = run.catch(() => undefined)
  return run
}

export class RouteError extends Error {}

type ValhallaLeg = { shape: string }
type ValhallaResponse = {
  trip?: {
    legs?: ValhallaLeg[]
    summary?: { length?: number; time?: number }
  }
}

type Waypoint = LatLon & { through?: boolean }

async function valhalla(points: Waypoint[], signal?: AbortSignal): Promise<RouteShape> {
  const body = {
    locations: points.map((p, i) => ({
      lat: Number(p.lat.toFixed(6)),
      lon: Number(p.lon.toFixed(6)),
      type: p.through && i > 0 && i < points.length - 1 ? 'break_through' : 'break',
      // Widen the snap radius so a waypoint dropped in a park or a field still
      // finds a path instead of failing the whole loop.
      radius: p.through ? 150 : 50,
    })),
    costing: 'pedestrian',
    costing_options: { pedestrian: { walking_speed: 9, use_ferry: 0, shortest: false } },
    directions_options: { units: 'kilometers' },
    directions_type: 'none',
  }

  const res = await queued(() =>
    fetch(VALHALLA, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
      signal,
    }),
  )

  if (!res.ok) throw new RouteError(`valhalla ${res.status}`)
  const data: ValhallaResponse = await res.json()
  const legs = data.trip?.legs ?? []
  if (legs.length === 0) throw new RouteError('valhalla: empty trip')

  const shape: [number, number][] = []
  for (const leg of legs) {
    const decoded = decodePolyline(leg.shape, 6)
    // Legs share their junction vertex; drop the duplicate when stitching.
    shape.push(...(shape.length ? decoded.slice(1) : decoded))
  }

  return {
    points: shape,
    meters: (data.trip?.summary?.length ?? 0) * 1000,
    seconds: data.trip?.summary?.time ?? 0,
  }
}

/** A plain A → B pedestrian route. */
export async function routeBetween(
  start: Place,
  end: Place,
  signal?: AbortSignal,
): Promise<RoutePlan> {
  const shape = await valhalla([start, end], signal)
  return { ...shape, kind: 'point-to-point', start, end }
}

/* ============================================================
   Distance-targeted suggestions
   ============================================================ */

/** Waypoints on a circle around `start`, routed back to `start`. */
function loopWaypoints(start: LatLon, radius: number, bearing0: number): Waypoint[] {
  const legs = [0, 90, 180, 270].map((offset) =>
    destination(start, (bearing0 + offset) % 360, radius),
  )
  return [start, ...legs.map((p) => ({ ...p, through: true })), start]
}

const TOLERANCE = 0.1
const MAX_ATTEMPTS = 3

type Attempt = { shape: RouteShape; error: number }

async function converge(
  targetMeters: number,
  firstGuess: number,
  build: (size: number) => Waypoint[],
  signal?: AbortSignal,
): Promise<RouteShape | null> {
  let size = firstGuess
  let best: Attempt | null = null

  for (let i = 0; i < MAX_ATTEMPTS; i++) {
    let shape: RouteShape
    try {
      shape = await valhalla(build(size), signal)
    } catch (err) {
      if (signal?.aborted) throw err
      // A waypoint landed somewhere unroutable — pull the ring in and retry.
      size *= 0.75
      continue
    }
    if (shape.meters < 200) {
      size *= 1.4
      continue
    }

    const error = Math.abs(shape.meters - targetMeters) / targetMeters
    if (!best || error < best.error) best = { shape, error }
    if (error <= TOLERANCE) break

    // Scale towards the target, clamped so one bad measurement cannot send
    // the next attempt somewhere absurd.
    const factor = Math.min(1.8, Math.max(0.55, targetMeters / shape.meters))
    size *= factor
  }

  return best ? best.shape : null
}

export async function buildLoop(
  start: LatLon,
  targetMeters: number,
  bearing0: number,
  signal?: AbortSignal,
): Promise<RouteShape | null> {
  // A routed square through four points on a circle of radius r measures
  // roughly 5.7r before street detours, so start a little under the circle.
  const firstRadius = (targetMeters / (2 * Math.PI)) * 0.88
  return converge(targetMeters, firstRadius, (r) => loopWaypoints(start, r, bearing0), signal)
}

export async function buildOneWay(
  start: LatLon,
  targetMeters: number,
  bearing0: number,
  signal?: AbortSignal,
): Promise<RouteShape | null> {
  // One intermediate point keeps the line from collapsing onto a motorway-ish
  // straight and makes the shape read like a run rather than a ruler.
  const build = (reach: number): Waypoint[] => {
    const mid = destination(start, (bearing0 + 28) % 360, reach * 0.55)
    const end = destination(start, bearing0, reach)
    return [start, { ...mid, through: true }, end]
  }
  return converge(targetMeters, targetMeters * 0.78, build, signal)
}

const SPREAD = [30, 150, 270]

/**
 * Three routes of roughly `targetKm`, fanned out in different directions so
 * the runner gets a real choice rather than three versions of the same street.
 */
export async function buildSuggestions(
  start: Place,
  targetKm: number,
  loop: boolean,
  signal?: AbortSignal,
): Promise<Suggestion[]> {
  const targetMeters = targetKm * 1000
  // Rotate the fan by the start coordinates so two nearby runs don't always
  // propose the identical three directions.
  const seed = Math.abs(Math.round((start.lat + start.lon) * 1000)) % 360

  const out: Suggestion[] = []
  for (const offset of SPREAD) {
    const b = (seed + offset) % 360
    const shape = loop
      ? await buildLoop(start, targetMeters, b, signal)
      : await buildOneWay(start, targetMeters, b, signal)
    if (!shape) continue

    const last = shape.points[shape.points.length - 1]
    const end: Place = loop
      ? start
      : {
          lat: last[0],
          lon: last[1],
          name: '',
          detail: '',
          id: `sug:${last[0].toFixed(5)},${last[1].toFixed(5)}`,
        }

    out.push({
      ...shape,
      kind: loop ? 'loop' : 'point-to-point',
      start,
      end,
      id: `${loop ? 'loop' : 'ow'}-${targetKm}-${b}`,
      targetKm,
      // Named after the direction the ring was rotated to, not after the
      // farthest vertex: two loops around the same park otherwise end up with
      // the same name and the runner cannot tell them apart.
      bearingLabel: compassOf(b),
    })
  }

  // Climb matters when choosing between three routes of the same length, so
  // the cards get it too. One elevation request each, and never fatal.
  const measured = await Promise.all(out.map((s) => withElevation(s, signal)))

  // Closest to the requested distance first.
  return measured.sort(
    (a, b) => Math.abs(a.meters - targetMeters) - Math.abs(b.meters - targetMeters),
  )
}

/* ============================================================
   Elevation
   ============================================================ */

/** Adds an elevation profile and total climb to a plan. Never fatal. */
export async function withElevation<T extends RoutePlan>(
  plan: T,
  signal?: AbortSignal,
): Promise<T> {
  const samples = samplePolyline(plan.points, 40)
  if (samples.length < 2) return plan
  try {
    const url = new URL(ELEVATION)
    url.searchParams.set('latitude', samples.map((p) => p.lat.toFixed(5)).join(','))
    url.searchParams.set('longitude', samples.map((p) => p.lon.toFixed(5)).join(','))
    const res = await fetch(url, { signal })
    if (!res.ok) return plan
    const data: { elevation?: number[] } = await res.json()
    if (!data.elevation || data.elevation.length < 2) return plan
    return { ...plan, elevation: data.elevation, ascent: Math.round(ascentOf(data.elevation)) }
  } catch {
    return plan
  }
}
