'use client'

import { useEffect, useRef } from 'react'

interface ScanPoint {
  lat: number
  lng: number
  city: string | null
  region: string | null
  country: string | null
  timestamp: string
}

interface ScanMapProps {
  points: ScanPoint[]
}

export default function ScanMap({ points }: ScanMapProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const mapRef = useRef<any>(null)

  useEffect(() => {
    if (!containerRef.current) return

    let cancelled = false

    async function init() {
      // Dynamic import keeps Leaflet 100% out of SSR/build-time execution
      const L = (await import('leaflet')).default
      // CSS must be imported after L is loaded so it lands in the same chunk
      await import('leaflet/dist/leaflet.css')

      if (cancelled || !containerRef.current) return

      // Tear down any previous instance (e.g. on hot-reload)
      if (mapRef.current) {
        mapRef.current.remove()
        mapRef.current = null
      }

      const valid = points.filter(p => p.lat != null && p.lng != null)

      const center: [number, number] = valid.length > 0
        ? [
            valid.reduce((s, p) => s + p.lat, 0) / valid.length,
            valid.reduce((s, p) => s + p.lng, 0) / valid.length,
          ]
        : [-26, 28] // South Africa default

      const map = L.map(containerRef.current, {
        center,
        zoom: valid.length > 0 ? 4 : 5,
        attributionControl: false,
        zoomControl: true,
      })

      L.tileLayer(
        'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png',
        { attribution: '© CARTO' }
      ).addTo(map)

      valid.forEach(p => {
        const marker = L.circleMarker([p.lat, p.lng], {
          radius: 7,
          color: '#E8650A',
          fillColor: '#E8650A',
          fillOpacity: 0.8,
          weight: 1.5,
        })

        const city = p.city ?? 'Unknown'
        const regionPart = p.region ? `, ${p.region}` : ''
        const country = p.country ?? ''
        const date = new Date(p.timestamp).toLocaleDateString()

        marker.bindTooltip(
          `<div style="font-family:Inter,sans-serif;font-size:12px;line-height:1.6">
            <strong>${city}${regionPart}</strong><br/>
            ${country}<br/>
            <span style="color:#888">${date}</span>
          </div>`,
          { direction: 'top', offset: [0, -10] }
        )

        marker.addTo(map)
      })

      mapRef.current = map
    }

    init()

    return () => {
      cancelled = true
      if (mapRef.current) {
        mapRef.current.remove()
        mapRef.current = null
      }
    }
  }, [points])

  return (
    <div
      ref={containerRef}
      style={{ width: '100%', height: '400px', background: '#0a0a0a' }}
    />
  )
}
