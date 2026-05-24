'use client'

import { useEffect } from 'react'
import { useSearchParams } from 'next/navigation'

// Bump cache key so old format (missing lat/lng) is ignored
const GEO_CACHE_KEY = 'kkfix_geo_v2'
const GEO_CACHE_TTL = 60 * 60 * 1000 // 1 hour

function getDeviceType(ua: string): 'mobile' | 'tablet' | 'desktop' {
  if (/tablet|ipad|playbook|silk/i.test(ua)) return 'tablet'
  if (/mobile|android|iphone|ipod|blackberry|iemobile|opera mini/i.test(ua)) return 'mobile'
  return 'desktop'
}

interface GeoCache {
  ts:      number
  lat:     number | null
  lng:     number | null
  city:    string | null
  region:  string | null
  country: string | null
  ip:      string | null
}

// Prompts the browser location permission dialog and resolves with GPS coords
function getGPSCoords(): Promise<{ lat: number | null; lng: number | null }> {
  return new Promise(resolve => {
    if (!navigator.geolocation) {
      resolve({ lat: null, lng: null })
      return
    }
    navigator.geolocation.getCurrentPosition(
      pos  => resolve({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
      ()   => resolve({ lat: null, lng: null }),
      { timeout: 8000, maximumAge: 0 }
    )
  })
}

async function getIpGeo(): Promise<{ city: string | null; region: string | null; country: string | null; ip: string | null }> {
  try {
    const controller = new AbortController()
    const timer = setTimeout(() => controller.abort(), 4000)
    const res = await fetch('https://ipapi.co/json/', { signal: controller.signal })
    clearTimeout(timer)
    if (res.ok) {
      const d = await res.json()
      return {
        city:    d.city         ?? null,
        region:  d.region       ?? null,
        country: d.country_name ?? null,
        ip:      d.ip           ?? null,
      }
    }
  } catch { /* timeout or network error — fall through */ }
  return { city: null, region: null, country: null, ip: null }
}

async function getGeo(): Promise<{ lat: number | null; lng: number | null; city: string | null; region: string | null; country: string | null; ip: string | null }> {
  try {
    const raw = localStorage.getItem(GEO_CACHE_KEY)
    if (raw) {
      const cached: GeoCache = JSON.parse(raw)
      if (Date.now() - cached.ts < GEO_CACHE_TTL) {
        return { lat: cached.lat, lng: cached.lng, city: cached.city, region: cached.region, country: cached.country, ip: cached.ip }
      }
    }
  } catch { /* storage unavailable */ }

  // Request GPS and IP geo in parallel — GPS shows browser permission prompt
  const [gps, ipGeo] = await Promise.all([getGPSCoords(), getIpGeo()])

  const result = {
    lat:     gps.lat,
    lng:     gps.lng,
    city:    ipGeo.city,
    region:  ipGeo.region,
    country: ipGeo.country,
    ip:      ipGeo.ip,
  }

  try {
    localStorage.setItem(GEO_CACHE_KEY, JSON.stringify({ ts: Date.now(), ...result }))
  } catch { /* storage full */ }

  return result
}

export default function QRScanTracker({ productId }: { productId: string | null }) {
  const searchParams = useSearchParams()

  useEffect(() => {
    // Only track actual QR code scans (URL must contain ?qr=1)
    if (searchParams.get('qr') !== '1') return

    const batchId = searchParams.get('batch')
    const unitId  = searchParams.get('unit')

    async function track() {
      const ua         = navigator.userAgent
      const deviceType = getDeviceType(ua)

      const { lat, lng, city, region, country, ip: ipAddress } = await getGeo()

      await fetch('/api/track-scan', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          lat, lng,
          city, region, country,
          device_type: deviceType,
          user_agent:  ua,
          batch_id:    batchId,
          unit_id:     unitId,
          ip_address:  ipAddress,
          product_id:  productId,
        }),
      })
    }

    track().catch(() => { /* never surface tracking errors to the user */ })
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  return null
}
