import { createServiceSupabaseClient } from './supabase-server'
import type { Product, Instruction, KitContent, SafetyItem, TechSpec, ProductWithRelations } from './types'

export async function getProductBySlug(slug: string): Promise<ProductWithRelations | null> {
  try {
    const supabase = createServiceSupabaseClient()

    // Fetch the product first — fail fast if it doesn't exist
    const { data: product, error: productError } = await supabase
      .from('products')
      .select('*')
      .eq('slug', slug)
      .eq('is_active', true)
      .single()

    if (productError || !product) return null

    const id = (product as Product).id

    // Fetch all related tables in parallel — each failure degrades gracefully to []
    const [
      { data: instructions },
      { data: safety_items },
      { data: kit_contents },
      { data: tech_specs },
    ] = await Promise.all([
      supabase.from('instructions').select('*').eq('product_id', id).order('step_number', { ascending: true }),
      supabase.from('safety_items').select('*').eq('product_id', id).order('sort_order', { ascending: true }),
      supabase.from('kit_contents').select('*').eq('product_id', id).order('sort_order', { ascending: true }),
      supabase.from('tech_specs').select('*').eq('product_id', id).order('sort_order', { ascending: true }),
    ])

    return {
      ...product,
      instructions: (instructions ?? []) as Instruction[],
      safety_items:  (safety_items  ?? []) as SafetyItem[],
      kit_contents:  (kit_contents  ?? []) as KitContent[],
      tech_specs:    (tech_specs    ?? []) as TechSpec[],
    } as ProductWithRelations
  } catch {
    return null
  }
}

export async function getAllProducts(): Promise<Product[]> {
  try {
    const supabase = createServiceSupabaseClient()
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .order('created_at', { ascending: false })

    if (error || !data) return []
    return data as Product[]
  } catch {
    return []
  }
}
