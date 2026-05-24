import { NextResponse } from 'next/server'
import { revalidatePath } from 'next/cache'
import { createServiceSupabaseClient } from '@/lib/supabase-server'

interface RouteParams { params: { id: string } }

export async function PATCH(request: Request, { params }: RouteParams) {
  try {
    const body = await request.json()
    const { product, kit_contents, instructions, safety_items, tech_specs } = body
    const id = params.id
    const supabase = createServiceSupabaseClient()

    if (product) {
      const { error } = await supabase.from('products').update(product).eq('id', id)
      if (error) return NextResponse.json({ error: error.message }, { status: 500 })
    }

    if (kit_contents !== undefined) {
      await supabase.from('kit_contents').delete().eq('product_id', id)
      if (kit_contents.length > 0) {
        const { error } = await supabase.from('kit_contents').insert(
          kit_contents.map((item: Record<string, unknown>, idx: number) => ({ ...item, product_id: id, sort_order: idx }))
        )
        if (error) return NextResponse.json({ error: error.message }, { status: 500 })
      }
    }

    if (instructions !== undefined) {
      await supabase.from('instructions').delete().eq('product_id', id)
      if (instructions.length > 0) {
        const { error } = await supabase.from('instructions').insert(
          instructions.map((item: Record<string, unknown>, idx: number) => ({ ...item, product_id: id, step_number: idx + 1 }))
        )
        if (error) return NextResponse.json({ error: error.message }, { status: 500 })
      }
    }

    if (safety_items !== undefined) {
      await supabase.from('safety_items').delete().eq('product_id', id)
      if (safety_items.length > 0) {
        const { error } = await supabase.from('safety_items').insert(
          safety_items.map((item: Record<string, unknown>, idx: number) => ({ ...item, product_id: id, sort_order: idx }))
        )
        if (error) return NextResponse.json({ error: error.message }, { status: 500 })
      }
    }

    if (tech_specs !== undefined) {
      await supabase.from('tech_specs').delete().eq('product_id', id)
      if (tech_specs.length > 0) {
        const { error } = await supabase.from('tech_specs').insert(
          tech_specs.map((item: Record<string, unknown>, idx: number) => ({ ...item, product_id: id, sort_order: idx }))
        )
        if (error) return NextResponse.json({ error: error.message }, { status: 500 })
      }
    }

    revalidatePath('/products/[slug]', 'page')
    revalidatePath('/admin/products', 'page')
    return NextResponse.json({ ok: true })
  } catch {
    return NextResponse.json({ error: 'Failed to update product' }, { status: 500 })
  }
}

export async function DELETE(_request: Request, { params }: RouteParams) {
  try {
    const supabase = createServiceSupabaseClient()
    const { error } = await supabase.from('products').delete().eq('id', params.id)
    if (error) return NextResponse.json({ error: error.message }, { status: 500 })
    revalidatePath('/products/[slug]', 'page')
    revalidatePath('/admin/products', 'page')
    return NextResponse.json({ ok: true })
  } catch {
    return NextResponse.json({ error: 'Failed to delete product' }, { status: 500 })
  }
}
