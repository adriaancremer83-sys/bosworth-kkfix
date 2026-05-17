import { createServerSupabaseClient } from './supabase-server'
import type { Product, Instruction, KitContent, SafetyItem, ProductWithRelations } from './types'

export async function getProductBySlug(slug: string): Promise<ProductWithRelations | null> {
  try {
    const supabase = await createServerSupabaseClient()
    const { data, error } = await supabase
      .from('products')
      .select(`
        *,
        instructions (*),
        safety_items (*),
        kit_contents (*)
      `)
      .eq('slug', slug)
      .eq('is_active', true)
      .single()

    if (error || !data) return null

    return {
      ...data,
      instructions: (data.instructions as Instruction[]).sort((a, b) => a.step_number - b.step_number),
      safety_items: (data.safety_items as SafetyItem[]).sort((a, b) => a.sort_order - b.sort_order),
      kit_contents: (data.kit_contents as KitContent[]).sort((a, b) => a.sort_order - b.sort_order),
    } as ProductWithRelations
  } catch {
    return null
  }
}

export async function getAllProducts(): Promise<Product[]> {
  try {
    const supabase = await createServerSupabaseClient()
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
