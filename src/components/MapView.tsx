import { useEffect, useRef } from 'react'
import L from 'leaflet'
import { boundsOf } from '../lib/geometry'
import type { RoutePlan } from '../lib/types'

type Props = {
  plan: RoutePlan | null
  /** Faint previews drawn under the active line */
  ghosts?: [number, number][][]
  attribution: string
  ariaLabel: string
  className?: string
}

// Plain raster tiles, no key and no account. The night look comes from a CSS
// filter on the tile pane rather than from a paid dark style.
const TILES = 'https://tile.openstreetmap.org/{z}/{x}/{y}.png'

function dot(kind: 'start' | 'end') {
  return L.divIcon({
    className: '',
    html: `<div class="dot dot-${kind}"></div>`,
    iconSize: [12, 12],
    iconAnchor: [6, 6],
  })
}

/**
 * Leaflet, driven imperatively. React owns *what* is on the map; Leaflet keeps
 * owning the DOM inside the container, which is the only way the two coexist
 * without the map being rebuilt on every state change.
 */
export function MapView({ plan, ghosts, attribution, ariaLabel, className }: Props) {
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

    L.tileLayer(TILES, { maxZoom: 19, attribution }).addTo(m)
    m.attributionControl.setPrefix('')

    layer.current = L.layerGroup().addTo(m)
    map.current = m

    // The container is sized by CSS after mount; Leaflet needs telling.
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
          color: '#8794a2',
          weight: 2,
          opacity: 0.35,
          dashArray: '2 8',
          lineCap: 'round',
        }).addTo(group)
      }
    }

    if (!plan || plan.points.length < 2) {
      const all = (ghosts ?? []).flat()
      if (all.length > 1) m.fitBounds(boundsOf(all), { padding: [26, 26] })
      return
    }

    // A dark casing keeps the route readable over pale streets and parks.
    // Solid, not dashed or animated: a moving line hides where it actually goes.
    L.polyline(plan.points, { color: '#07080a', weight: 9, opacity: 0.9, lineCap: 'round', lineJoin: 'round' }).addTo(group)
    L.polyline(plan.points, {
      color: '#d8ff36',
      weight: 4,
      lineCap: 'round',
      lineJoin: 'round',
    }).addTo(group)

    const first = plan.points[0]
    const last = plan.points[plan.points.length - 1]
    L.marker(first, { icon: dot('start'), keyboard: false, interactive: false }).addTo(group)
    if (plan.kind !== 'loop') {
      L.marker(last, { icon: dot('end'), keyboard: false, interactive: false }).addTo(group)
    }

    m.fitBounds(boundsOf(plan.points), { padding: [28, 28] })
  }, [plan, ghosts])

  return (
    <div
      ref={host}
      role="application"
      aria-label={ariaLabel}
      className={`h-[300px] w-full sm:h-[440px] ${className ?? ''}`}
    />
  )
}
