import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const {
      lat, lng, city, region, country,
      device_type, user_agent,
      batch_id, unit_id, ip_address, product_id,
      location_source,
    } = body

    // Use client-reported IP; fall back to request headers when ipapi.co is unavailable
    const serverIp =
      request.headers.get('x-real-ip') ??
      request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ??
      null
    const resolvedIp = (ip_address as string | null) ?? serverIp

    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!,
      { auth: { autoRefreshToken: false, persistSession: false } }
    )

    const { error } = await supabase.from('qr_scans').insert({
      lat: lat ?? null,
      lng: lng ?? null,
      city: city ?? null,
      region: region ?? null,
      country: country ?? null,
      device_type: device_type ?? null,
      user_agent: user_agent ?? null,
      batch_id: batch_id ?? null,
      unit_id: unit_id ?? null,
      ip_address: resolvedIp,
      product_id: (product_id as string | null) ?? null,
      location_source: (location_source as string | null) ?? 'unknown',
    })

    if (error) {
      console.error('[track-scan] insert error:', error.message, error.details)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }
    console.log('[track-scan] inserted scan for product:', product_id)
    return NextResponse.json({ ok: true })
  } catch (err) {
    console.error('[track-scan] unexpected error:', err)
    return NextResponse.json({ error: 'Failed' }, { status: 500 })
  }
}
