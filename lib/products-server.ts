import type { Product, ProductWithRelations } from './types'
import { KK_FIX } from './product-data'

/**
 * Content is static (see lib/product-data.ts). These helpers keep the same
 * signatures the pages already use.
 */

export async function getProductBySlug(slug: string): Promise<ProductWithRelations | null> {
  return slug === KK_FIX.slug ? KK_FIX : null
}

export async function getAllProducts(): Promise<Product[]> {
  return [KK_FIX]
}
