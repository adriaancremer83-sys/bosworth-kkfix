import { createClient } from './supabase'
import type { Product, Instruction, KitContent, SafetyItem } from './types'

export async function createProduct(productData: Partial<Product>): Promise<Product> {
  const supabase = createClient()
  const { data, error } = await supabase
    .from('products')
    .insert(productData)
    .select()
    .single()

  if (error) throw new Error(error.message)
  return data as Product
}

export async function updateProduct(id: string, productData: Partial<Product>): Promise<Product> {
  const supabase = createClient()
  const { data, error } = await supabase
    .from('products')
    .update(productData)
    .eq('id', id)
    .select()
    .single()

  if (error) throw new Error(error.message)
  return data as Product
}

export async function deleteProduct(id: string): Promise<void> {
  const supabase = createClient()
  const { error } = await supabase.from('products').delete().eq('id', id)
  if (error) throw new Error(error.message)
}

export async function toggleProductActive(id: string, isActive: boolean): Promise<void> {
  const supabase = createClient()
  const { error } = await supabase
    .from('products')
    .update({ is_active: isActive })
    .eq('id', id)

  if (error) throw new Error(error.message)
}

export async function upsertInstructions(
  productId: string,
  instructions: Partial<Instruction>[]
): Promise<void> {
  const supabase = createClient()
  const { error: deleteError } = await supabase
    .from('instructions')
    .delete()
    .eq('product_id', productId)

  if (deleteError) throw new Error(deleteError.message)
  if (instructions.length === 0) return

  const rows = instructions.map((inst, idx) => ({
    product_id: productId,
    step_number: inst.step_number ?? idx + 1,
    title: inst.title ?? '',
    description: inst.description ?? '',
    warning: inst.warning ?? null,
  }))

  const { error } = await supabase.from('instructions').insert(rows)
  if (error) throw new Error(error.message)
}

export async function upsertKitContents(
  productId: string,
  items: Partial<KitContent>[]
): Promise<void> {
  const supabase = createClient()
  const { error: deleteError } = await supabase
    .from('kit_contents')
    .delete()
    .eq('product_id', productId)

  if (deleteError) throw new Error(deleteError.message)
  if (items.length === 0) return

  const rows = items.map((item, idx) => ({
    product_id: productId,
    item_name: item.item_name ?? '',
    item_description: item.item_description ?? null,
    quantity: item.quantity ?? null,
    sort_order: item.sort_order ?? idx,
  }))

  const { error } = await supabase.from('kit_contents').insert(rows)
  if (error) throw new Error(error.message)
}

export async function upsertSafetyItems(
  productId: string,
  items: Partial<SafetyItem>[]
): Promise<void> {
  const supabase = createClient()
  const { error: deleteError } = await supabase
    .from('safety_items')
    .delete()
    .eq('product_id', productId)

  if (deleteError) throw new Error(deleteError.message)
  if (items.length === 0) return

  const rows = items.map((item, idx) => ({
    product_id: productId,
    icon: item.icon ?? 'alert-triangle',
    label: item.label ?? '',
    description: item.description ?? null,
    type: item.type ?? 'warning',
    sort_order: item.sort_order ?? idx,
  }))

  const { error } = await supabase.from('safety_items').insert(rows)
  if (error) throw new Error(error.message)
}
