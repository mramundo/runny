import { useEffect, useRef } from 'react'
import L from 'leaflet'
import { boundsOf } from '../lib/geometry'
import type { RoutePlan } from '../lib/types'

type Props = {
  plan: RoutePlan | null
  /** Faint previews drawn under the active route */
  ghosts?: [number, number][][]
  startLabel: string
  endLabel: string
  attribution: string
  ariaLabel: string
  className?: string
}

const TILES = 'https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png'

function pin(kind: 'start' | 'end', label: string) {
  return L.divIcon({
    className: '',
    html: `<div class="pin pin-${kind}">${label}</div>`,
    iconSize: [30, 30],
    iconAnchor: [15, 15],
  })
}

/**
 * Leaflet, driven imperatively. React owns *what* is on the map; Leaflet keeps
 * owning the DOM inside the container, which is the only way the two coexist
 * without the map being torn down on every state change.
 */
export function MapView({ plan, ghosts, startLabel, endLabel, attribution, ariaLabel, className }: Props) {
  const host = useRef<HTMLDivElement>(null)
  const map = useRef<L.Map | null>(null)
  const layer = useRef<L.LayerGroup | null>(null)

  useEffect(() => {
    if (!host.current || map.current) return
    const m = L.map(host.current, {
      zoomControl: true,
      attributionControl: true,
      // Wheel zoom stays off so scrolling the page never zooms the map by
      // accident; pinch and the zoom buttons still work.
      scrollWheelZoom: false,
    }).setView([41.9028, 12.4964], 12)

    L.tileLayer(TILES, {
      maxZoom: 19,
      subdomains: 'abcd',
      attribution,
    }).addTo(m)

    layer.current = L.layerGroup().addTo(m)
    map.current = m

    // The container is laid out by CSS after mount; Leaflet needs telling.
    const t = setTimeout(() => m.invalidateSize(), 80)
    return () => {
      clearTimeout(t)
      m.remove()
      map.current = null
      layer.current = null
    }
  }, [attribution])

  useEffect(() => {
    const m = map.current
    const group = layer.current
    if (!m || !group) return
    group.clearLayers()

    for (const ghost of ghosts ?? []) {
      if (ghost.length > 1) {
        L.polyline(ghost, {
          color: '#12161c',
          weight: 4,
          opacity: 0.18,
          dashArray: '2 10',
          lineCap: 'round',
        }).addTo(group)
      }
    }

    if (!plan || plan.points.length < 2) {
      if ((ghosts?.length ?? 0) === 0) return
      const all = (ghosts ?? []).flat()
      if (all.length > 1) m.fitBounds(boundsOf(all), { padding: [28, 28] })
      return
    }

    // Ink casing under a volt line: the same border-plus-fill rule as the cards.
    L.polyline(plan.points, { color: '#12161c', weight: 11, lineCap: 'round', lineJoin: 'round' }).addTo(group)
    L.polyline(plan.points, {
      color: '#c6f135',
      weight: 6,
      lineCap: 'round',
      lineJoin: 'round',
      dashArray: '26 14',
      className: 'route-line',
    }).addTo(group)

    const first = plan.points[0]
    const last = plan.points[plan.points.length - 1]
    L.marker(first, { icon: pin('start', startLabel), keyboard: false, title: startLabel }).addTo(group)
    if (plan.kind !== 'loop') {
      L.marker(last, { icon: pin('end', endLabel), keyboard: false, title: endLabel }).addTo(group)
    }

    m.fitBounds(boundsOf(plan.points), { padding: [30, 30] })
  }, [plan, ghosts, startLabel, endLabel])

  return (
    <div
      ref={host}
      role="application"
      aria-label={ariaLabel}
      className={`h-[320px] w-full overflow-hidden rounded-[1.1rem] border-[3px] border-ink sm:h-[420px] ${className ?? ''}`}
    />
  )
}
