import { NextResponse } from 'next/server'
import { createServiceSupabaseClient } from '@/lib/supabase-server'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { product, kit_contents, instructions, safety_items, tech_specs } = body

    const supabase = createServiceSupabaseClient()

    const { data, error } = await supabase
      .from('products')
      .insert(product)
      .select('id')
      .single()

    if (error) return NextResponse.json({ error: error.message }, { status: 500 })

    const productId = data.id

    if (kit_contents?.length > 0) {
      const { error: e } = await supabase.from('kit_contents').insert(
        kit_contents.map((item: Record<string, unknown>, idx: number) => ({ ...item, product_id: productId, sort_order: idx }))
      )
      if (e) return NextResponse.json({ error: e.message }, { status: 500 })
    }

    if (instructions?.length > 0) {
      const { error: e } = await supabase.from('instructions').insert(
        instructions.map((item: Record<string, unknown>, idx: number) => ({ ...item, product_id: productId, step_number: idx + 1 }))
      )
      if (e) return NextResponse.json({ error: e.message }, { status: 500 })
    }

    if (safety_items?.length > 0) {
      const { error: e } = await supabase.from('safety_items').insert(
        safety_items.map((item: Record<string, unknown>, idx: number) => ({ ...item, product_id: productId, sort_order: idx }))
      )
      if (e) return NextResponse.json({ error: e.message }, { status: 500 })
    }

    if (tech_specs?.length > 0) {
      const { error: e } = await supabase.from('tech_specs').insert(
        tech_specs.map((item: Record<string, unknown>, idx: number) => ({ ...item, product_id: productId, sort_order: idx }))
      )
      if (e) return NextResponse.json({ error: e.message }, { status: 500 })
    }

    return NextResponse.json({ id: productId })
  } catch {
    return NextResponse.json({ error: 'Failed to create product' }, { status: 500 })
  }
}
