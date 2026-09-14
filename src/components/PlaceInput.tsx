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
  accent: 'volt' | 'ice'
  disabled?: boolean
  onError?: (message: string) => void
  strings: { searching: string; noResults: string; clear: string }
}

const DEBOUNCE_MS = 280

/**
 * Type-ahead over the place index. Requests are debounced and the previous one
 * is aborted, so a fast typist never sees an older answer land on a newer one.
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

  // A place chosen elsewhere (the locate button, a suggested line) has to show
  // up in the field without the field fighting back.
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

  return (
    <div className="relative min-w-0" ref={box}>
      <label className="label flex items-center gap-2">
        <span
          className={`inline-block h-1.5 w-1.5 rounded-full ${accent === 'volt' ? 'bg-volt' : 'bg-ice'}`}
        />
        {label}
      </label>

      <div className="relative mt-1">
        <input
          className="field"
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
            className="absolute top-1/2 right-0 -translate-y-1/2 px-2 font-mono text-sm text-faint transition-colors hover:text-flare"
            onClick={() => {
              dirty.current = false
              setText('')
              setResults([])
              setOpen(false)
              onChange(null)
            }}
          >
            ✕
          </button>
        )}
      </div>

      {value && !open && value.detail && (
        <p className="clip mt-1.5 line-clamp-1 font-mono text-[0.68rem] text-faint">{value.detail}</p>
      )}

      {open && (
        <ul
          id={listId}
          role="listbox"
          className="panel-raised absolute z-30 mt-1 max-h-72 w-full overflow-auto"
        >
          {busy && results.length === 0 && <li className="label px-3 py-3">{strings.searching}…</li>}
          {!busy && results.length === 0 && <li className="label px-3 py-3">{strings.noResults}</li>}
          {results.map((r, i) => (
            <li key={r.id} role="option" aria-selected={i === active} className="border-b border-line-soft last:border-0">
              <button
                type="button"
                className={`w-full px-3 py-2.5 text-left transition-colors ${
                  i === active ? 'bg-panel text-volt' : 'hover:bg-panel'
                }`}
                onMouseEnter={() => setActive(i)}
                onClick={() => pick(r)}
              >
                <span className="clip block truncate text-sm font-semibold">{r.name}</span>
                {r.detail && (
                  <span className="clip block truncate font-mono text-[0.66rem] text-faint">{r.detail}</span>
                )}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
