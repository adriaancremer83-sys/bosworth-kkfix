'use client'

import { useEffect } from 'react'
import { useSearchParams } from 'next/navigation'

function getDeviceType(ua: string): 'mobile' | 'tablet' | 'desktop' {
  if (/tablet|ipad|playbook|silk/i.test(ua)) return 'tablet'
  if (/mobile|android|iphone|ipod|blackberry|iemobile|opera mini/i.test(ua)) return 'mobile'
  return 'desktop'
}

export default function QRScanTracker({ productId }: { productId: string | null }) {
  const searchParams = useSearchParams()

  useEffect(() => {
    const batchId = searchParams.get('batch')
    const unitId = searchParams.get('unit')

    async function track() {
      const ua = navigator.userAgent
      const deviceType = getDeviceType(ua)

      // Always get IP-based location for city/region/country
      let city: string | null = null
      let region: string | null = null
      let country: string | null = null
      let ipAddress: string | null = null

      try {
        const res = await fetch('https://ipapi.co/json/', { cache: 'no-store' })
        if (res.ok) {
          const d = await res.json()
          city = d.city ?? null
          region = d.region ?? null
          country = d.country_name ?? null
          ipAddress = d.ip ?? null
        }
      } catch { /* silent */ }

      // Try precise geolocation (optional, user may deny)
      let lat: number | null = null
      let lng: number | null = null

      if ('geolocation' in navigator) {
        try {
          const pos = await new Promise<GeolocationPosition>((resolve, reject) =>
            navigator.geolocation.getCurrentPosition(resolve, reject, { timeout: 6000, maximumAge: 300000 })
          )
          lat = pos.coords.latitude
          lng = pos.coords.longitude
        } catch { /* denied or unavailable — fine */ }
      }

      await fetch('/api/track-scan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          lat, lng, city, region, country,
          device_type: deviceType,
          user_agent: ua,
          batch_id: batchId,
          unit_id: unitId,
          ip_address: ipAddress,
          product_id: productId,
        }),
      })
    }

    track().catch(() => { /* never surface errors to the user */ })
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  return null
}
