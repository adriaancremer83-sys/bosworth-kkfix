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

const LEAFLET_VERSION = '1.9.4'
const CDN = `https://unpkg.com/leaflet@${LEAFLET_VERSION}/dist`

function injectLeafletCSS() {
  if (document.querySelector('link[data-leaflet]')) return
  const link = document.createElement('link')
  link.rel = 'stylesheet'
  link.href = `${CDN}/leaflet.css`
  link.setAttribute('data-leaflet', '')
  document.head.appendChild(link)
}

function loadLeafletScript(): Promise<void> {
  return new Promise((resolve, reject) => {
    if ((window as any).L) { resolve(); return }

    const existing = document.querySelector('script[data-leaflet]') as HTMLScriptElement | null
    if (existing) {
      existing.addEventListener('load', () => resolve())
      existing.addEventListener('error', reject)
      return
    }

    const script = document.createElement('script')
    script.src = `${CDN}/leaflet.js`
    script.setAttribute('data-leaflet', '')
    script.onload = () => resolve()
    script.onerror = reject
    document.head.appendChild(script)
  })
}

export default function ScanMap({ points }: ScanMapProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const mapRef = useRef<any>(null)

  useEffect(() => {
    if (!containerRef.current) return

    let cancelled = false

    async function init() {
      injectLeafletCSS()
      await loadLeafletScript()

      if (cancelled || !containerRef.current) return

      if (mapRef.current) {
        mapRef.current.remove()
        mapRef.current = null
      }

      const L = (window as any).L
      const valid = points.filter(p => p.lat != null && p.lng != null)

      const center: [number, number] = valid.length > 0
        ? [
            valid.reduce((s, p) => s + p.lat, 0) / valid.length,
            valid.reduce((s, p) => s + p.lng, 0) / valid.length,
          ]
        : [-26, 28]

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
