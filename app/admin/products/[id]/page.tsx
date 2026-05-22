import { notFound } from 'next/navigation'
import { createServiceSupabaseClient } from '@/lib/supabase-server'
import ProductForm from '@/components/admin/ProductForm'
import type { ProductWithRelations, Instruction, SafetyItem, KitContent, TechSpec } from '@/lib/types'

interface PageProps {
  params: { id: string }
}

async function getProductById(id: string): Promise<ProductWithRelations | null> {
  try {
    const supabase = createServiceSupabaseClient()

    const { data: product, error } = await supabase
      .from('products')
      .select('*')
      .eq('id', id)
      .single()

    if (error || !product) return null

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

export default async function EditProductPage({ params }: PageProps) {
  const product = await getProductById(params.id)
  if (!product) notFound()

  return (
    <div>
      <h1 className="font-display text-3xl md:text-5xl tracking-wide mb-8 leading-tight" style={{ color: '#F5F5F0' }}>
        Edit — {product.name}
      </h1>
      <ProductForm product={product} />
    </div>
  )
}
