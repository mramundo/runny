import { useCallback, useEffect, useRef } from 'react'
import L from 'leaflet'
import { boundsOf, offsetPolyline } from '../lib/geometry'
import type { RoutePlan } from '../lib/types'

type Props = {
  plan: RoutePlan | null
  attribution: string
  ariaLabel: string
  className?: string
}

// Plain raster tiles, no key and no account. The night look comes from a CSS
// filter on the tile pane rather than from a paid dark style.
const TILES = 'https://tile.openstreetmap.org/{z}/{x}/{y}.png'

/** How far to the side of the road the route is drawn, in screen pixels. */
const OFFSET_PX = 7

function dot(kind: 'start' | 'end') {
  return L.divIcon({
    className: '',
    html: `<div class="dot dot-${kind}"></div>`,
    iconSize: [12, 12],
    iconAnchor: [6, 6],
  })
}

/** Metres covered by one screen pixel at this zoom and latitude. */
function metresPerPixel(lat: number, zoom: number): number {
  return (156543.03392 * Math.cos((lat * Math.PI) / 180)) / 2 ** zoom
}

/**
 * Leaflet, driven imperatively. React owns *what* is on the map; Leaflet keeps
 * owning the DOM inside the container, which is the only way the two coexist
 * without the map being rebuilt on every state change.
 */
export function MapView({ plan, attribution, ariaLabel, className }: Props) {
  const host = useRef<HTMLDivElement>(null)
  const map = useRef<L.Map | null>(null)
  const layer = useRef<L.LayerGroup | null>(null)

  const draw = useCallback(() => {
    const m = map.current
    const group = layer.current
    if (!m || !group) return
    group.clearLayers()
    if (!plan || plan.points.length < 2) return

    // Drawn a few pixels to the right of the road rather than on it: a route
    // that goes up a street and back down it would otherwise be one line
    // hiding another. The offset is recomputed per zoom so the two directions
    // stay the same distance apart on screen at every scale.
    const mpp = metresPerPixel(m.getCenter().lat, m.getZoom())
    const line = offsetPolyline(plan.points, OFFSET_PX * mpp)

    L.polyline(line, { color: '#07080a', weight: 12, opacity: 0.92, lineCap: 'round', lineJoin: 'round' }).addTo(group)
    L.polyline(line, { color: '#d8ff36', weight: 6, lineCap: 'round', lineJoin: 'round' }).addTo(group)

    L.marker(line[0], { icon: dot('start'), keyboard: false, interactive: false }).addTo(group)
    if (plan.kind !== 'loop') {
      L.marker(line[line.length - 1], { icon: dot('end'), keyboard: false, interactive: false }).addTo(group)
    }
  }, [plan])

  /** Frame the route, then draw it: the sideways offset is measured in screen
   *  pixels, so it depends on the zoom the fit settles on. */
  const fitAndDraw = useCallback(() => {
    const m = map.current
    if (!m) return
    // Framed without animation so the new zoom is in effect by the next line,
    // which measures the sideways offset from it.
    if (plan && plan.points.length > 1) {
      m.fitBounds(boundsOf(plan.points), { padding: [28, 28], animate: false })
    }
    draw()
  }, [draw, plan])

  // The handlers below are registered once; these refs keep them pointed at
  // the latest props without re-subscribing on every render.
  const drawRef = useRef(draw)
  drawRef.current = draw
  const fitRef = useRef(fitAndDraw)
  fitRef.current = fitAndDraw

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

    const onZoom = () => drawRef.current()
    m.on('zoomend', onZoom)
    // A resize changes the zoom the route fits at, so it has to be re-framed
    // and re-drawn, not just redrawn.
    const onResize = () => fitRef.current()
    m.on('resize', onResize)

    // The container is laid out by CSS after mount and can change size later
    // (a phone rotating, a panel reflowing). Until Leaflet is told, it keeps
    // fitting routes to the wrong box.
    const observer = new ResizeObserver(() => m.invalidateSize())
    observer.observe(host.current)

    return () => {
      observer.disconnect()
      m.off('zoomend', onZoom)
      m.off('resize', onResize)
      m.remove()
      map.current = null
      layer.current = null
    }
  }, [attribution])

  useEffect(() => {
    fitAndDraw()
  }, [fitAndDraw])

  return (
    <div
      ref={host}
      role="application"
      aria-label={ariaLabel}
      className={`h-[300px] w-full sm:h-[440px] ${className ?? ''}`}
    />
  )
}
