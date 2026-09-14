import type { Lang } from './types'

export type DistancePreset = {
  km: number
  /** What the session is, in one or two words */
  note: Record<Lang, string>
}

/**
 * The distances a half or full marathon block is actually built from, not
 * just the round numbers. Each one is a session a runner recognises.
 */
export const DISTANCES: DistancePreset[] = [
  { km: 5, note: { en: 'Intervals', it: 'Ripetute' } },
  { km: 8, note: { en: 'Easy run', it: 'Fondo lento' } },
  { km: 10, note: { en: 'Steady', it: 'Medio' } },
  { km: 12, note: { en: 'Midweek long', it: 'Lungo infrasettimanale' } },
  { km: 16, note: { en: 'Half long run', it: 'Lungo da mezza' } },
  { km: 18, note: { en: 'Progression', it: 'Progressivo' } },
  { km: 21.1, note: { en: 'Half marathon', it: 'Mezza maratona' } },
  { km: 24, note: { en: 'Easy long', it: 'Lungo lento' } },
  { km: 28, note: { en: 'Marathon long', it: 'Lungo da maratona' } },
  { km: 32, note: { en: 'The key session', it: 'Il lungo chiave' } },
  { km: 35, note: { en: 'Dress rehearsal', it: 'Prova generale' } },
  { km: 42.2, note: { en: 'Marathon', it: 'Maratona' } },
]

export const DEFAULT_PACE = 6
export const MIN_PACE = 3.5
export const MAX_PACE = 9
