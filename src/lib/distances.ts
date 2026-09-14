import type { Lang } from './types'

export type DistancePreset = {
  km: number
  label: Record<Lang, string>
  note: Record<Lang, string>
}

/**
 * The distances that actually show up in half and full marathon blocks.
 * Anything longer than 42.2 is a personal problem, not a preset.
 */
export const DISTANCES: DistancePreset[] = [
  {
    km: 5,
    label: { en: '5K', it: '5K' },
    note: { en: 'Tempo & intervals', it: 'Ritmo e ripetute' },
  },
  {
    km: 10,
    label: { en: '10K', it: '10K' },
    note: { en: 'Midweek staple', it: 'Il medio infrasettimanale' },
  },
  {
    km: 15,
    label: { en: '15K', it: '15K' },
    note: { en: 'Half-build long run', it: 'Lungo da mezza' },
  },
  {
    km: 21.1,
    label: { en: 'Half', it: 'Mezza' },
    note: { en: 'Race rehearsal', it: 'Prova gara' },
  },
  {
    km: 30,
    label: { en: '30K', it: '30K' },
    note: { en: 'Marathon key session', it: 'Il lungo chiave' },
  },
  {
    km: 42.2,
    label: { en: 'Marathon', it: 'Maratona' },
    note: { en: 'You already know', it: 'Lo sai già' },
  },
]

export const DEFAULT_PACE = 6
export const MIN_PACE = 3.5
export const MAX_PACE = 9
