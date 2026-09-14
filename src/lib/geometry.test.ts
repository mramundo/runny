import { describe, expect, it } from 'vitest'
import {
  ascentOf,
  bearing,
  boundsOf,
  compassOf,
  decodePolyline,
  destination,
  haversine,
  offsetPolyline,
  polylineLength,
  samplePolyline,
} from './geometry'

const ROME = { lat: 41.9028, lon: 12.4964 }

describe('haversine', () => {
  it('is zero for the same point', () => {
    expect(haversine(ROME, ROME)).toBe(0)
  })

  it('matches a known distance (Rome -> Milan is about 477 km)', () => {
    const milan = { lat: 45.4642, lon: 9.19 }
    const d = haversine(ROME, milan) / 1000
    expect(d).toBeGreaterThan(470)
    expect(d).toBeLessThan(485)
  })
})

describe('destination / bearing', () => {
  it('round-trips through the bearing', () => {
    const p = destination(ROME, 45, 5000)
    expect(haversine(ROME, p)).toBeCloseTo(5000, 0)
    expect(bearing(ROME, p)).toBeCloseTo(45, 1)
  })

  it('heads north for bearing 0', () => {
    const p = destination(ROME, 0, 1000)
    expect(p.lat).toBeGreaterThan(ROME.lat)
    expect(p.lon).toBeCloseTo(ROME.lon, 6)
  })
})

describe('compassOf', () => {
  it('snaps to the eight points', () => {
    expect(compassOf(0)).toBe('n')
    expect(compassOf(44)).toBe('ne')
    expect(compassOf(91)).toBe('e')
    expect(compassOf(181)).toBe('s')
    expect(compassOf(359)).toBe('n')
  })
})

describe('decodePolyline', () => {
  it('decodes the Google reference string at precision 5', () => {
    const pts = decodePolyline('_p~iF~ps|U_ulLnnqC_mqNvxq`@', 5)
    expect(pts).toHaveLength(3)
    expect(pts[0][0]).toBeCloseTo(38.5, 5)
    expect(pts[0][1]).toBeCloseTo(-120.2, 5)
    expect(pts[2][0]).toBeCloseTo(43.252, 5)
    expect(pts[2][1]).toBeCloseTo(-126.453, 5)
  })

  it('returns nothing for an empty shape', () => {
    expect(decodePolyline('')).toEqual([])
  })
})

describe('polylineLength / samplePolyline', () => {
  const line: [number, number][] = Array.from({ length: 21 }, (_, i) => {
    const p = destination(ROME, 90, i * 500)
    return [p.lat, p.lon] as [number, number]
  })

  it('measures the whole line', () => {
    expect(polylineLength(line) / 1000).toBeCloseTo(10, 1)
  })

  it('always includes both ends', () => {
    const s = samplePolyline(line, 5)
    expect(s).toHaveLength(5)
    expect(s[0].lat).toBeCloseTo(line[0][0], 6)
    expect(s[4].lon).toBeCloseTo(line[line.length - 1][1], 3)
  })

  it('never asks for more samples than it has vertices', () => {
    expect(samplePolyline(line.slice(0, 3), 8)).toHaveLength(3)
  })
})

describe('ascentOf', () => {
  it('sums only the climbs and ignores sensor noise', () => {
    expect(ascentOf([100, 110, 105, 125])).toBe(30)
    expect(ascentOf([100, 100.4, 100.8])).toBe(0)
  })
})

describe('boundsOf', () => {
  it('wraps every point', () => {
    const b = boundsOf([
      [1, 2],
      [-3, 8],
      [5, -1],
    ])
    expect(b).toEqual([
      [-3, -1],
      [5, 8],
    ])
  })
})


describe('offsetPolyline', () => {
  // Due east, then back due west along the same street.
  const east = destination(ROME, 90, 400)
  const outAndBack: [number, number][] = [
    [ROME.lat, ROME.lon],
    [east.lat, east.lon],
    [ROME.lat, ROME.lon],
  ]

  it('leaves a line alone when the offset is zero', () => {
    expect(offsetPolyline(outAndBack, 0)).toEqual(outAndBack)
  })

  it('separates the two directions of an out-and-back', () => {
    const shifted = offsetPolyline(outAndBack, 20)
    // Outbound and inbound share a vertex in the original; after the shift the
    // first and last points must sit on opposite sides of the street.
    const gap = haversine(
      { lat: shifted[0][0], lon: shifted[0][1] },
      { lat: shifted[2][0], lon: shifted[2][1] },
    )
    expect(gap).toBeGreaterThan(30)
  })

  it('shifts a straight eastbound line to the south', () => {
    const line: [number, number][] = [
      [ROME.lat, ROME.lon],
      [east.lat, east.lon],
    ]
    const shifted = offsetPolyline(line, 25)
    expect(shifted[0][0]).toBeLessThan(ROME.lat)
    expect(haversine({ lat: shifted[0][0], lon: shifted[0][1] }, ROME)).toBeCloseTo(25, 0)
  })
})
