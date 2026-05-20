'use client'

import { useEffect } from 'react'
import { MapContainer, TileLayer, CircleMarker, Tooltip } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'

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
  const validPoints = points.filter(p => p.lat != null && p.lng != null)

  const center: [number, number] = validPoints.length > 0
    ? [
        validPoints.reduce((s, p) => s + p.lat, 0) / validPoints.length,
        validPoints.reduce((s, p) => s + p.lng, 0) / validPoints.length,
      ]
    : [-26, 28] // default: South Africa

  return (
    <MapContainer
      center={center}
      zoom={validPoints.length > 0 ? 4 : 5}
      style={{ width: '100%', height: '400px', background: '#0a0a0a' }}
      attributionControl={false}>
      <TileLayer
        url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
        attribution='&copy; <a href="https://carto.com/">CARTO</a>'
      />
      {validPoints.map((p, i) => (
        <CircleMarker
          key={i}
          center={[p.lat, p.lng]}
          radius={7}
          pathOptions={{
            color: '#E8650A',
            fillColor: '#E8650A',
            fillOpacity: 0.8,
            weight: 1.5,
          }}>
          <Tooltip direction="top" offset={[0, -8]}>
            <div style={{ fontFamily: 'Inter, sans-serif', fontSize: '12px', lineHeight: 1.5 }}>
              <strong>{p.city ?? 'Unknown'}</strong>{p.region ? `, ${p.region}` : ''}<br />
              {p.country ?? ''}<br />
              <span style={{ color: '#888' }}>{new Date(p.timestamp).toLocaleDateString()}</span>
            </div>
          </Tooltip>
        </CircleMarker>
      ))}
    </MapContainer>
  )
}
