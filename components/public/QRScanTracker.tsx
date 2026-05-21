'use client'

import { useEffect } from 'react'
import { useSearchParams } from 'next/navigation'

const GEO_CACHE_KEY = 'kkfix_geo'
const GEO_CACHE_TTL = 60 * 60 * 1000 // 1 hour

function getDeviceType(ua: string): 'mobile' | 'tablet' | 'desktop' {
  if (/tablet|ipad|playbook|silk/i.test(ua)) return 'tablet'
  if (/mobile|android|iphone|ipod|blackberry|iemobile|opera mini/i.test(ua)) return 'mobile'
  return 'desktop'
}

interface GeoCache {
  ts: number
  city: string | null
  region: string | null
  country: string | null
  ip: string | null
}

async function getGeo(): Promise<{ city: string | null; region: string | null; country: string | null; ip: string | null }> {
  // Return cached value if still fresh
  try {
    const raw = localStorage.getItem(GEO_CACHE_KEY)
    if (raw) {
      const cached: GeoCache = JSON.parse(raw)
      if (Date.now() - cached.ts < GEO_CACHE_TTL) {
        return { city: cached.city, region: cached.region, country: cached.country, ip: cached.ip }
      }
    }
  } catch { /* ignore storage errors */ }

  // Fetch with 3s timeout
  try {
    const controller = new AbortController()
    const timer = setTimeout(() => controller.abort(), 3000)
    const res = await fetch('https://ipapi.co/json/', { signal: controller.signal })
    clearTimeout(timer)

    if (res.ok) {
      const d = await res.json()
      const result = {
        city:    d.city    ?? null,
        region:  d.region  ?? null,
        country: d.country_name ?? null,
        ip:      d.ip      ?? null,
      }
      try {
        localStorage.setItem(GEO_CACHE_KEY, JSON.stringify({ ts: Date.now(), ...result }))
      } catch { /* storage full or unavailable */ }
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
      const ua         = navigator.userAgent
      const deviceType = getDeviceType(ua)

      const { city, region, country, ip: ipAddress } = await getGeo()

      await fetch('/api/track-scan', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          lat: null, lng: null,
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

    track().catch(() => { /* never surface errors to the user */ })
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  return null
}
