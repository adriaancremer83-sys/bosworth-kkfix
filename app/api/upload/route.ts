import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

const ALLOWED_BUCKETS = ['step-images', 'product-images', 'kit-images']

export async function POST(request: Request) {
  try {
    const url = new URL(request.url)
    const bucket = url.searchParams.get('bucket') ?? 'step-images'

    if (!ALLOWED_BUCKETS.includes(bucket)) {
      return NextResponse.json({ error: 'Invalid bucket' }, { status: 400 })
    }

    const formData = await request.formData()
    const file = formData.get('file') as File | null
    if (!file) return NextResponse.json({ error: 'No file provided' }, { status: 400 })

    if (file.size > 2 * 1024 * 1024) {
      return NextResponse.json({ error: 'File too large (max 2MB)' }, { status: 400 })
    }

    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!,
      { auth: { autoRefreshToken: false, persistSession: false } }
    )

    const ext = file.name.split('.').pop()?.toLowerCase() ?? 'jpg'
    const prefix = bucket.replace('-images', '')
    const fileName = `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`
    const buffer = Buffer.from(await file.arrayBuffer())

    const { error } = await supabase.storage
      .from(bucket)
      .upload(fileName, buffer, {
        contentType: file.type || 'image/jpeg',
        cacheControl: '3600',
        upsert: false,
      })

    if (error) return NextResponse.json({ error: error.message }, { status: 500 })

    const { data: { publicUrl } } = supabase.storage
      .from(bucket)
      .getPublicUrl(fileName)

    return NextResponse.json({ url: publicUrl })
  } catch {
    return NextResponse.json({ error: 'Upload failed' }, { status: 500 })
  }
}
