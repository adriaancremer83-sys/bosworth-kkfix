import { getAllProducts } from '@/lib/products-server'
import QRGenerator from '@/components/admin/QRGenerator'

interface PageProps {
  searchParams: { product?: string }
}

export default async function QRPage({ searchParams }: PageProps) {
  const products = await getAllProducts()

  return (
    <QRGenerator products={products} initialProductId={searchParams.product} />
  )
}
