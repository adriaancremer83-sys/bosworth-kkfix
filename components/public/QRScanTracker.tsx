'use client'

import { useEffect } from 'react'
import { useSearchParams } from 'next/navigation'

const IP_CACHE_KEY = 'kkfix_ipgeo_v1'
const IP_CACHE_TTL = 60 * 60 * 1000 // 1 hour

function getDeviceType(ua: string): 'mobile' | 'tablet' | 'desktop' {
  if (/tablet|ipad|playbook|silk/i.test(ua)) return 'tablet'
  if (/mobile|android|iphone|ipod|blackberry|iemobile|opera mini/i.test(ua)) return 'mobile'
  return 'desktop'
}

function getGPSCoords(): Promise<{ lat: number | null; lng: number | null }> {
  return new Promise(resolve => {
    if (!navigator.geolocation) return resolve({ lat: null, lng: null })
    navigator.geolocation.getCurrentPosition(
      pos => resolve({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
      ()  => resolve({ lat: null, lng: null }),
      { timeout: 5000, maximumAge: 60000 }
    )
  })
}

// Reverse geocode GPS coords to get accurate city/region/country
async function reverseGeocode(lat: number, lng: number): Promise<{ city: string | null; region: string | null; country: string | null }> {
  try {
    const controller = new AbortController()
    const timer = setTimeout(() => controller.abort(), 5000)
    const res = await fetch(
      `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json`,
      { signal: controller.signal, headers: { 'User-Agent': 'KK-Fix/1.0 (bosworth-kkfix)' } }
    )
    clearTimeout(timer)
    if (res.ok) {
      const d = await res.json()
      const addr = d.address ?? {}
      return {
        city:    addr.city ?? addr.town ?? addr.village ?? addr.suburb ?? null,
        region:  addr.state ?? addr.county ?? null,
        country: addr.country ?? null,
      }
    }
  } catch { /* timeout or network error */ }
  return { city: null, region: null, country: null }
}

async function getIpGeo(): Promise<{ city: string | null; region: string | null; country: string | null; ip: string | null }> {
  try {
    const raw = localStorage.getItem(IP_CACHE_KEY)
    if (raw) {
      const c = JSON.parse(raw)
      if (Date.now() - c.ts < IP_CACHE_TTL) return c
    }
  } catch { /* storage unavailable */ }

  try {
    const controller = new AbortController()
    const timer = setTimeout(() => controller.abort(), 4000)
    const res = await fetch('https://ipapi.co/json/', { signal: controller.signal })
    clearTimeout(timer)
    if (res.ok) {
      const d = await res.json()
      const result = {
        city:    d.city         ?? null,
        region:  d.region       ?? null,
        country: d.country_name ?? null,
        ip:      d.ip           ?? null,
      }
      try { localStorage.setItem(IP_CACHE_KEY, JSON.stringify({ ts: Date.now(), ...result })) } catch {}
      return result
    }
  } catch { /* timeout or network error */ }

  return { city: null, region: null, country: null, ip: null }
}

export default function QRScanTracker({ productId }: { productId: string | null }) {
  const searchParams = useSearchParams()

  useEffect(() => {
    const batchId = searchParams.get('batch')
    const unitId  = searchParams.get('unit')

    async function track() {
      const ua = navigator.userAgent

      // Always fetch IP geo for the IP address field; run GPS in parallel
      const [gps, ipGeo] = await Promise.all([getGPSCoords(), getIpGeo()])

      let city: string | null
      let region: string | null
      let country: string | null
      let locationSource: 'gps' | 'ip' | 'unknown'

      if (gps.lat != null && gps.lng != null) {
        // GPS succeeded — reverse geocode for accurate city/region/country
        const geo = await reverseGeocode(gps.lat, gps.lng)
        city    = geo.city    ?? ipGeo.city
        region  = geo.region  ?? ipGeo.region
        country = geo.country ?? ipGeo.country
        locationSource = 'gps'
      } else {
        // No GPS — fall back to IP geolocation
        city    = ipGeo.city
        region  = ipGeo.region
        country = ipGeo.country
        locationSource = ipGeo.ip != null ? 'ip' : 'unknown'
      }

      try {
        const res = await fetch('/api/track-scan', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            lat:             gps.lat,
            lng:             gps.lng,
            city,
            region,
            country,
            device_type:     getDeviceType(ua),
            user_agent:      ua,
            batch_id:        batchId  ?? null,
            unit_id:         unitId   ?? null,
            ip_address:      ipGeo.ip,
            product_id:      productId,
            location_source: locationSource,
          }),
        })
        if (!res.ok) {
          const json = await res.json().catch(() => ({}))
          console.error('[QRScanTracker] insert failed:', json.error ?? res.status)
        }
      } catch (err) {
        console.error('[QRScanTracker] fetch error:', err)
      }
    }

    track().catch(console.error)
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  return null
}
