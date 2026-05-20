import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const {
      lat, lng, city, region, country,
      device_type, user_agent,
      batch_id, unit_id, ip_address, product_id,
    } = body

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
      ip_address: ip_address ?? null,
      product_id: product_id ?? null,
    })

    if (error) return NextResponse.json({ error: error.message }, { status: 500 })
    return NextResponse.json({ ok: true })
  } catch {
    return NextResponse.json({ error: 'Failed' }, { status: 500 })
  }
}
