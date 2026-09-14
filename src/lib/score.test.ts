import { describe, expect, it } from 'vitest'
import {
  bandOf,
  bestPerDay,
  dewScore,
  findWindows,
  ramp,
  runnyScore,
  tempScore,
  topWindows,
  uvScore,
  windowHours,
} from './score'
import type { HourPoint } from './types'

describe('ramp', () => {
  it('clamps outside the table', () => {
    const table: [number, number][] = [
      [0, 10],
      [10, 20],
    ]
    expect(ramp(-5, table)).toBe(10)
    expect(ramp(99, table)).toBe(20)
  })

  it('interpolates inside a segment', () => {
    expect(ramp(5, [
      [0, 0],
      [10, 100],
    ])).toBe(50)
  })
})

describe('component scores', () => {
  it('peaks in the 8-14 degree plateau', () => {
    expect(tempScore(10)).toBe(100)
    expect(tempScore(28)).toBeLessThan(tempScore(18))
    expect(tempScore(-10)).toBeLessThan(tempScore(2))
  })

  it('punishes muggy air through the dew point', () => {
    expect(dewScore(8)).toBe(100)
    expect(dewScore(21)).toBeLessThan(30)
    expect(dewScore(24)).toBeLessThan(dewScore(18))
  })

  it('ignores UV at night', () => {
    expect(uvScore(9, false)).toBe(100)
    expect(uvScore(9, true)).toBeLessThan(40)
  })
})

const base = {
  apparent: 11,
  dewPoint: 7,
  precipProb: 5,
  precipMm: 0,
  wind: 8,
  gusts: 14,
  uv: 1,
  isDay: true,
  weatherCode: 1,
}

describe('runnyScore', () => {
  it('rates a crisp still morning near the top', () => {
    expect(runnyScore(base)).toBeGreaterThan(90)
  })

  it('caps thunderstorms no matter how pleasant the rest is', () => {
    expect(runnyScore({ ...base, weatherCode: 95 })).toBeLessThanOrEqual(16)
  })

  it('caps extreme apparent heat', () => {
    expect(runnyScore({ ...base, apparent: 34, dewPoint: 6 })).toBeLessThanOrEqual(26)
  })

  it('drops with muggy heat', () => {
    const muggy = runnyScore({ ...base, apparent: 27, dewPoint: 21 })
    expect(muggy).toBeLessThan(runnyScore(base))
    expect(muggy).toBeLessThan(45)
  })

  it('stays inside 0-100', () => {
    expect(
      runnyScore({ ...base, apparent: 45, dewPoint: 30, precipProb: 100, precipMm: 40, wind: 90, gusts: 120, uv: 13, weatherCode: 99 }),
    ).toBeGreaterThanOrEqual(0)
  })
})

describe('bandOf', () => {
  it('maps the score onto the five bands', () => {
    expect(bandOf(95)).toBe('perfect')
    expect(bandOf(70)).toBe('great')
    expect(bandOf(50)).toBe('ok')
    expect(bandOf(35)).toBe('poor')
    expect(bandOf(10)).toBe('bad')
  })
})

describe('windowHours', () => {
  it('rounds a run up to whole hours', () => {
    expect(windowHours(5, 6)).toBe(1)
    expect(windowHours(10, 6)).toBe(1)
    expect(windowHours(15, 6)).toBe(2)
    expect(windowHours(42.2, 6)).toBe(5)
  })
})

/** Builds a synthetic day starting at `startHour` with the given scores. */
function series(dayIso: string, startHour: number, scores: number[]): HourPoint[] {
  return scores.map((score, i) => {
    const hour = startHour + i
    const time = `${dayIso}T${String(hour).padStart(2, '0')}:00`
    return {
      time,
      t: Date.parse(`${time}:00Z`),
      temp: 15,
      apparent: 15,
      humidity: 60,
      dewPoint: 8,
      precipProb: 0,
      precipMm: 0,
      wind: 5,
      gusts: 9,
      uv: 1,
      cloud: 20,
      isDay: true,
      weatherCode: 1,
      score,
    }
  })
}

describe('findWindows', () => {
  const hours = series('2026-06-01', 4, [40, 90, 95, 30, 20, 80, 85])

  it('respects the daytime bounds', () => {
    const windows = findWindows(hours, {
      hours: 2,
      dayStart: 5,
      dayEnd: 22,
      includeNight: false,
      now: 0,
    })
    // The 04:00 start is outside 05:00-22:00 and must be dropped.
    expect(windows.every((w) => Number(w.startIso.slice(11, 13)) >= 5)).toBe(true)
    expect(windows[0].score).toBe(93)
  })

  it('drops windows that already started', () => {
    const now = Date.parse('2026-06-01T08:00:00Z')
    const windows = findWindows(hours, {
      hours: 1,
      dayStart: 0,
      dayEnd: 24,
      includeNight: true,
      now,
    })
    expect(windows.every((w) => w.startT >= now)).toBe(true)
  })

  it('never spans a gap in the series', () => {
    const gapped = [...series('2026-06-01', 6, [90, 90]), ...series('2026-06-01', 10, [95, 95])]
    const windows = findWindows(gapped, {
      hours: 2,
      dayStart: 0,
      dayEnd: 24,
      includeNight: true,
      now: 0,
    })
    expect(windows).toHaveLength(2)
  })
})

describe('topWindows / bestPerDay', () => {
  const hours = [
    ...series('2026-06-01', 6, [95, 92, 40, 41, 88, 90]),
    ...series('2026-06-02', 6, [60, 62, 70, 72, 30, 31]),
  ]
  const windows = findWindows(hours, {
    hours: 2,
    dayStart: 5,
    dayEnd: 22,
    includeNight: false,
    now: 0,
  })

  it('returns non-overlapping picks, best first', () => {
    const top = topWindows(windows, 3)
    expect(top.length).toBeLessThanOrEqual(3)
    for (let i = 1; i < top.length; i++) {
      expect(top[i].score).toBeLessThanOrEqual(top[i - 1].score)
    }
    for (const a of top) {
      for (const b of top) {
        if (a === b) continue
        expect(a.startT < b.endT && b.startT < a.endT).toBe(false)
      }
    }
  })

  it('keeps one window per day', () => {
    const perDay = bestPerDay(windows)
    expect(perDay.map((w) => w.day)).toEqual(['2026-06-01', '2026-06-02'])
    expect(perDay[0].score).toBeGreaterThan(perDay[1].score)
  })
})
