import type { Band, HourPoint, RunWindow } from './types'

/** Piecewise-linear lookup over an ascending table of [x, y] points. */
export function ramp(x: number, table: [number, number][]): number {
  if (x <= table[0][0]) return table[0][1]
  const last = table[table.length - 1]
  if (x >= last[0]) return last[1]
  for (let i = 1; i < table.length; i++) {
    const [x0, y0] = table[i - 1]
    const [x1, y1] = table[i]
    if (x <= x1) return y0 + ((x - x0) / (x1 - x0)) * (y1 - y0)
  }
  return last[1]
}

const clamp = (v: number, lo = 0, hi = 100) => Math.min(hi, Math.max(lo, v))

/**
 * Apparent temperature, not the raw thermometer reading: sun and wind change
 * how a 20 °C run feels far more than the number on the forecast does.
 * The plateau sits at 6–14 °C, where road racing times are fastest.
 */
export function tempScore(apparent: number): number {
  return ramp(apparent, [
    [-12, 12],
    [-5, 38],
    [0, 58],
    [5, 86],
    [8, 100],
    [14, 100],
    [18, 82],
    [22, 58],
    [26, 32],
    [30, 12],
    [34, 0],
  ])
}

/**
 * Dew point is the honest humidity number: it is absolute, so it means the
 * same thing at 8 °C and at 28 °C. Above ~16 °C sweat stops evaporating
 * properly and pace drifts whatever the thermometer says.
 */
export function dewScore(dewPoint: number): number {
  return ramp(dewPoint, [
    [0, 100],
    [10, 100],
    [13, 86],
    [16, 66],
    [18, 46],
    [21, 22],
    [24, 6],
    [27, 0],
  ])
}

/** Chance of rain, then scaled down by how much rain is actually coming. */
export function rainScore(probability: number, mm: number): number {
  const base = ramp(probability, [
    [0, 100],
    [10, 96],
    [20, 86],
    [40, 56],
    [60, 32],
    [80, 12],
    [100, 0],
  ])
  const wetFactor = ramp(mm, [
    [0, 1],
    [0.5, 0.85],
    [2, 0.5],
    [5, 0.2],
    [10, 0.05],
  ])
  return clamp(base * wetFactor)
}

/** A breeze helps you cool down; a gale ruins the second half. */
export function windScore(speedKmh: number, gustsKmh: number): number {
  const base = ramp(speedKmh, [
    [0, 96],
    [6, 100],
    [12, 98],
    [18, 88],
    [25, 70],
    [33, 48],
    [45, 22],
    [60, 4],
    [80, 0],
  ])
  const gustPenalty = gustsKmh > 45 ? (gustsKmh - 45) * 1.4 : 0
  return clamp(base - gustPenalty)
}

/** Night runs get a free pass; midday in July does not. */
export function uvScore(uv: number, isDay: boolean): number {
  if (!isDay) return 100
  return ramp(uv, [
    [0, 100],
    [2, 100],
    [3, 92],
    [5, 74],
    [7, 52],
    [9, 28],
    [11, 8],
    [13, 0],
  ])
}

/**
 * Heat stress is one number, not two: apparent temperature and dew point are
 * blended with the *worse* of the pair carrying most of the weight, because a
 * cool-but-soupy morning and a hot-but-dry afternoon are both hard runs and an
 * average would flatter each of them.
 */
export function heatScore(apparent: number, dewPoint: number): number {
  const a = tempScore(apparent)
  const b = dewScore(dewPoint)
  return 0.68 * Math.min(a, b) + 0.32 * Math.max(a, b)
}

/**
 * Rain, wind and UV cannot make a run pleasant — they can only spoil one — so
 * they act as multipliers on the heat base rather than as points that top it
 * back up. The floors keep a single bad factor from zeroing the whole score
 * before the hard caps below get their say.
 */
function dampen(score: number, floor: number): number {
  return floor + (1 - floor) * (clamp(score) / 100)
}

const FLOORS = { rain: 0.35, wind: 0.45, uv: 0.55 }

const THUNDER = new Set([95, 96, 99])
const HEAVY = new Set([65, 67, 75, 82, 86])

export type ScoreInput = {
  apparent: number
  dewPoint: number
  precipProb: number
  precipMm: number
  wind: number
  gusts: number
  uv: number
  isDay: boolean
  weatherCode: number
}

/**
 * 0-100. Heat sets the ceiling, the other factors chip away at it, and the
 * caps at the end exist so one genuinely disqualifying condition cannot be
 * averaged away by four pleasant ones.
 */
export function runnyScore(h: ScoreInput): number {
  const heat = heatScore(h.apparent, h.dewPoint)

  let score =
    heat *
    dampen(rainScore(h.precipProb, h.precipMm), FLOORS.rain) *
    dampen(windScore(h.wind, h.gusts), FLOORS.wind) *
    dampen(uvScore(h.uv, h.isDay), FLOORS.uv)

  if (THUNDER.has(h.weatherCode)) score = Math.min(score, 16)
  if (HEAVY.has(h.weatherCode)) score = Math.min(score, 28)
  if (h.precipMm >= 4) score = Math.min(score, 30)
  if (h.apparent >= 32) score = Math.min(score, 26)
  if (h.apparent <= -8) score = Math.min(score, 34)
  if (h.wind >= 55) score = Math.min(score, 34)
  if (h.isDay && h.uv >= 10) score = Math.min(score, 50)

  return Math.round(clamp(score))
}

export function bandOf(score: number): Band {
  if (score >= 82) return 'perfect'
  if (score >= 66) return 'great'
  if (score >= 48) return 'ok'
  if (score >= 30) return 'poor'
  return 'bad'
}

/* ============================================================
   Windows
   ============================================================ */

/** Whole hours a run of `km` takes at `paceMinPerKm`, never less than one. */
export function windowHours(km: number, paceMinPerKm: number): number {
  const minutes = km * paceMinPerKm
  return Math.min(8, Math.max(1, Math.ceil(minutes / 60)))
}

const mean = (xs: number[]) => xs.reduce((a, b) => a + b, 0) / xs.length

export type WindowOptions = {
  /** Window length in whole hours */
  hours: number
  /** Earliest acceptable local start hour, inclusive */
  dayStart: number
  /** Latest acceptable local end hour, exclusive */
  dayEnd: number
  includeNight: boolean
  /** Epoch ms; windows starting before this are in the past */
  now: number
}

/** Local wall-clock hour, read off the Open-Meteo ISO string (no zone maths). */
export function localHour(iso: string): number {
  return Number(iso.slice(11, 13))
}

export function localDay(iso: string): string {
  return iso.slice(0, 10)
}

/** Every window of `hours` consecutive hours that satisfies the constraints. */
export function findWindows(hours: HourPoint[], opts: WindowOptions): RunWindow[] {
  const out: RunWindow[] = []
  const n = opts.hours

  for (let i = 0; i + n <= hours.length; i++) {
    const slice = hours.slice(i, i + n)
    if (slice[0].t < opts.now) continue

    // Hours must be contiguous — a gap in the series would silently stretch
    // a "3 hour" window across a missing hour.
    const contiguous = slice.every(
      (h, k) => k === 0 || h.t - slice[k - 1].t === 3_600_000,
    )
    if (!contiguous) continue

    if (!opts.includeNight) {
      const startH = localHour(slice[0].time)
      const endH = startH + n
      if (startH < opts.dayStart || endH > opts.dayEnd) continue
    }

    const score = Math.round(mean(slice.map((h) => h.score)))
    out.push({
      startIso: slice[0].time,
      endIso: slice[slice.length - 1].time,
      startT: slice[0].t,
      endT: slice[slice.length - 1].t + 3_600_000,
      score,
      apparent: mean(slice.map((h) => h.apparent)),
      temp: mean(slice.map((h) => h.temp)),
      humidity: mean(slice.map((h) => h.humidity)),
      precipProb: Math.max(...slice.map((h) => h.precipProb)),
      wind: mean(slice.map((h) => h.wind)),
      uv: Math.max(...slice.map((h) => h.uv)),
      weatherCode: Math.max(...slice.map((h) => h.weatherCode)),
      isDay: slice.filter((h) => h.isDay).length * 2 >= slice.length,
      day: localDay(slice[0].time),
    })
  }
  return out
}

/**
 * Highest-scoring windows that do not overlap each other, best first — the
 * first entry is the one the app calls the top pick, so the order is the
 * ranking, not the clock.
 */
export function topWindows(windows: RunWindow[], limit: number): RunWindow[] {
  const ranked = [...windows].sort((a, b) => b.score - a.score || a.startT - b.startT)
  const picked: RunWindow[] = []
  for (const w of ranked) {
    if (picked.length >= limit) break
    if (picked.some((p) => w.startT < p.endT && p.startT < w.endT)) continue
    picked.push(w)
  }
  return picked
}

/** The single best window of each local day, in chronological order. */
export function bestPerDay(windows: RunWindow[]): RunWindow[] {
  const byDay = new Map<string, RunWindow>()
  for (const w of windows) {
    const current = byDay.get(w.day)
    if (!current || w.score > current.score) byDay.set(w.day, w)
  }
  return [...byDay.values()].sort((a, b) => a.startT - b.startT)
}
