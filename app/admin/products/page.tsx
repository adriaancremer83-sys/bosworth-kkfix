import Link from 'next/link'
import { getAllProducts } from '@/lib/products-server'
import ProductsTable from '@/components/admin/ProductsTable'
import { PlusCircle, QrCode } from 'lucide-react'

export default async function AdminProductsPage() {
  const products = await getAllProducts()

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-end gap-3">
          <h1 className="font-display text-5xl tracking-wide" style={{ color: '#F5F5F0' }}>Products</h1>
          <span className="mb-1 px-2 py-0.5 rounded text-sm"
            style={{ background: 'rgba(200,16,46,0.15)', border: '1px solid rgba(200,16,46,0.3)', color: '#E8650A' }}>
            {products.length}
          </span>
        </div>
        <Link
          href="/admin/products/new"
          className="flex items-center gap-2 px-3 md:px-4 py-2.5 rounded text-sm font-medium tracking-wide"
          style={{ background: '#E8650A', color: '#F5F5F0' }}>
          <PlusCircle size={16} />
          <span className="hidden md:inline">Add New Product</span>
        </Link>
      </div>

      {products.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 rounded-lg"
          style={{ background: '#1C1C1C', border: '1px solid #383838' }}>
          <QrCode size={48} className="mb-4" style={{ color: '#383838' }} />
          <p className="font-display text-2xl mb-2" style={{ color: '#8A8A8A' }}>No products yet</p>
          <Link href="/admin/products/new" className="text-sm underline" style={{ color: '#E8650A' }}>
            Add your first product
          </Link>
        </div>
      ) : (
        <ProductsTable initialProducts={products} />
      )}
    </div>
  )
}
