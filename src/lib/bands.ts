import type { Band } from './types'

/** One place decides what a band looks like, in SVG and in Tailwind alike. */
export const BAND_HEX: Record<Band, string> = {
  perfect: '#23d6a0',
  great: '#a9e634',
  ok: '#ffc93c',
  poor: '#ff8a3d',
  bad: '#ff4b3e',
}

export const BAND_BG: Record<Band, string> = {
  perfect: 'bg-band-perfect',
  great: 'bg-band-great',
  ok: 'bg-band-ok',
  poor: 'bg-band-poor',
  bad: 'bg-band-bad',
}

export const BAND_ORDER: Band[] = ['perfect', 'great', 'ok', 'poor', 'bad']
