import { useEffect, useId, useRef, useState } from 'react'
import { searchPlaces } from '../lib/geo'
import type { Lang, LatLon, Place } from '../lib/types'

type Props = {
  label: string
  placeholder: string
  value: Place | null
  onChange: (place: Place | null) => void
  lang: Lang
  near: LatLon | null
  accent: 'volt' | 'cool'
  disabled?: boolean
  onError?: (message: string) => void
  strings: { searching: string; noResults: string; clear: string }
}

const DEBOUNCE_MS = 280

/**
 * Type-ahead over Photon. Requests are debounced and the previous one is
 * aborted, so a fast typist never sees an older answer overwrite a newer one.
 */
export function PlaceInput({
  label,
  placeholder,
  value,
  onChange,
  lang,
  near,
  accent,
  disabled,
  onError,
  strings,
}: Props) {
  const [text, setText] = useState(value ? value.name : '')
  const [results, setResults] = useState<Place[]>([])
  const [open, setOpen] = useState(false)
  const [busy, setBusy] = useState(false)
  const [active, setActive] = useState(-1)
  const listId = useId()
  const box = useRef<HTMLDivElement>(null)
  const dirty = useRef(false)

  // A place chosen elsewhere (GPS, a suggestion) must show up in the field.
  useEffect(() => {
    if (!dirty.current) setText(value ? value.name : '')
  }, [value])

  useEffect(() => {
    if (!dirty.current) return
    const q = text.trim()
    if (q.length < 2) {
      setResults([])
      setOpen(false)
      return
    }
    const ctrl = new AbortController()
    const timer = setTimeout(async () => {
      setBusy(true)
      try {
        const found = await searchPlaces(q, lang, near, ctrl.signal)
        setResults(found)
        setOpen(true)
        setActive(-1)
      } catch (err) {
        if (!ctrl.signal.aborted) onError?.(String(err))
      } finally {
        if (!ctrl.signal.aborted) setBusy(false)
      }
    }, DEBOUNCE_MS)

    return () => {
      clearTimeout(timer)
      ctrl.abort()
    }
    // `onError` is a render-stable callback from the parent; excluded on purpose.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [text, lang, near])

  useEffect(() => {
    function onDocPointer(e: PointerEvent) {
      if (box.current && !box.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('pointerdown', onDocPointer)
    return () => document.removeEventListener('pointerdown', onDocPointer)
  }, [])

  function pick(place: Place) {
    dirty.current = false
    setText(place.name)
    setResults([])
    setOpen(false)
    onChange(place)
  }

  function onKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (!open || results.length === 0) return
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      setActive((i) => (i + 1) % results.length)
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setActive((i) => (i <= 0 ? results.length - 1 : i - 1))
    } else if (e.key === 'Enter' && active >= 0) {
      e.preventDefault()
      pick(results[active])
    } else if (e.key === 'Escape') {
      setOpen(false)
    }
  }

  const dot = accent === 'volt' ? 'bg-volt-400' : 'bg-cool-300'

  return (
    <div className="relative" ref={box}>
      <label className="font-display mb-1.5 flex items-center gap-2 text-xs font-black tracking-[0.14em] uppercase">
        <span className={`inline-block h-3 w-3 rounded-full border-[2.5px] border-ink ${dot}`} />
        {label}
      </label>

      <div className="relative">
        <input
          className="field pr-11"
          type="text"
          value={text}
          placeholder={placeholder}
          disabled={disabled}
          autoComplete="off"
          role="combobox"
          aria-expanded={open}
          aria-controls={listId}
          aria-autocomplete="list"
          onChange={(e) => {
            dirty.current = true
            setText(e.target.value)
            if (value) onChange(null)
          }}
          onFocus={() => results.length > 0 && setOpen(true)}
          onKeyDown={onKeyDown}
        />
        {text.length > 0 && (
          <button
            type="button"
            aria-label={strings.clear}
            className="absolute top-1/2 right-3 -translate-y-1/2 rounded-full border-[2.5px] border-ink bg-white px-2 text-sm leading-none font-black transition hover:bg-heat-200"
            onClick={() => {
              dirty.current = false
              setText('')
              setResults([])
              setOpen(false)
              onChange(null)
            }}
          >
            ×
          </button>
        )}
      </div>

      {value && !open && (
        <p className="mt-1 truncate pl-1 text-xs font-semibold text-ink-soft">{value.detail}</p>
      )}

      {open && (
        <ul
          id={listId}
          role="listbox"
          className="card-sm absolute z-30 mt-2 max-h-72 w-full overflow-auto p-1.5"
        >
          {busy && results.length === 0 && (
            <li className="px-3 py-2 text-sm font-bold text-ink-soft">{strings.searching}</li>
          )}
          {!busy && results.length === 0 && (
            <li className="px-3 py-2 text-sm font-bold text-ink-soft">{strings.noResults}</li>
          )}
          {results.map((r, i) => (
            <li key={r.id} role="option" aria-selected={i === active}>
              <button
                type="button"
                className={`w-full rounded-[0.7rem] px-3 py-2 text-left transition ${
                  i === active ? 'bg-volt-300' : 'hover:bg-paper-dim'
                }`}
                onMouseEnter={() => setActive(i)}
                onClick={() => pick(r)}
              >
                <span className="block truncate font-extrabold">{r.name}</span>
                {r.detail && (
                  <span className="block truncate text-xs font-semibold text-ink-soft">{r.detail}</span>
                )}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
