import type { Band } from './types'

/** One place decides what a band looks like, in SVG and in CSS alike. */
export const BAND_HEX: Record<Band, string> = {
  perfect: '#2ee6a8',
  great: '#b8f03c',
  ok: '#ffd23f',
  poor: '#ff8a3d',
  bad: '#ff4d5e',
}

export const BAND_ORDER: Band[] = ['perfect', 'great', 'ok', 'poor', 'bad']
