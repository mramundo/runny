import { DATE_LOCALE } from './i18n'
import type { Lang } from './types'

export function km(meters: number, lang: Lang): string {
  const v = meters / 1000
  return v.toLocaleString(DATE_LOCALE[lang], {
    minimumFractionDigits: v < 10 ? 2 : 1,
    maximumFractionDigits: v < 10 ? 2 : 1,
  })
}

export function meters(m: number, lang: Lang): string {
  return Math.round(m).toLocaleString(DATE_LOCALE[lang])
}

/** "1h 12m" / "48m" */
export function duration(seconds: number, lang: Lang): string {
  const total = Math.max(1, Math.round(seconds / 60))
  const h = Math.floor(total / 60)
  const m = total % 60
  if (h === 0) return `${m}m`
  return lang === 'it' ? `${h}h ${m.toString().padStart(2, '0')}m` : `${h}h ${m.toString().padStart(2, '0')}m`
}

/** Run time implied by distance and pace, in seconds. */
export function runSeconds(meters: number, paceMinPerKm: number): number {
  return (meters / 1000) * paceMinPerKm * 60
}

/** 5.5 -> "5:30" */
export function pace(paceMinPerKm: number): string {
  const m = Math.floor(paceMinPerKm)
  const s = Math.round((paceMinPerKm - m) * 60)
  return `${m}:${s.toString().padStart(2, '0')}`
}

/** "07:00" from an Open-Meteo local ISO string, with no timezone maths. */
export function clock(iso: string): string {
  return iso.slice(11, 16)
}

const DAY_MS = 86_400_000

/**
 * "Today" / "Tomorrow" / "Thu 18". Compared in the *route's* local calendar,
 * which is the calendar printed in the ISO strings, so no conversion is done.
 */
export function dayLabel(iso: string, todayIso: string, lang: Lang, words: { today: string; tomorrow: string }): string {
  const day = iso.slice(0, 10)
  const today = todayIso.slice(0, 10)
  if (day === today) return words.today
  const diff = Math.round((Date.parse(`${day}T00:00:00Z`) - Date.parse(`${today}T00:00:00Z`)) / DAY_MS)
  if (diff === 1) return words.tomorrow
  return new Date(`${day}T12:00:00Z`).toLocaleDateString(DATE_LOCALE[lang], {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
    timeZone: 'UTC',
  })
}

export function round(value: number, digits = 0): number {
  const f = 10 ** digits
  return Math.round(value * f) / f
}
