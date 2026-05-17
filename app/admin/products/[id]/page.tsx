import { notFound } from 'next/navigation'
import { createServerSupabaseClient } from '@/lib/supabase-server'
import ProductForm from '@/components/admin/ProductForm'
import type { ProductWithRelations, Instruction, SafetyItem, KitContent } from '@/lib/types'

interface PageProps {
  params: { id: string }
}

async function getProductById(id: string): Promise<ProductWithRelations | null> {
  try {
    const supabase = await createServerSupabaseClient()
    const { data, error } = await supabase
      .from('products')
      .select('*, instructions(*), safety_items(*), kit_contents(*)')
      .eq('id', id)
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

export default async function EditProductPage({ params }: PageProps) {
  const product = await getProductById(params.id)
  if (!product) notFound()

  return (
    <div>
      <h1 className="font-display text-5xl tracking-wide mb-8" style={{ color: '#F5F5F0' }}>
        Edit — {product.name}
      </h1>
      <ProductForm product={product} />
    </div>
  )
}
