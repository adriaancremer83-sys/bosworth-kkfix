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

      const [gps, ipGeo] = await Promise.all([getGPSCoords(), getIpGeo()])

      const locationSource: 'gps' | 'ip' | 'unknown' =
        gps.lat != null ? 'gps' : ipGeo.ip != null ? 'ip' : 'unknown'

      try {
        const res = await fetch('/api/track-scan', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            lat:             gps.lat,
            lng:             gps.lng,
            city:            ipGeo.city,
            region:          ipGeo.region,
            country:         ipGeo.country,
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
