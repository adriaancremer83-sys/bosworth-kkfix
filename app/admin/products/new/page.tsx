import ProductForm from '@/components/admin/ProductForm'

export default function NewProductPage() {
  return (
    <div>
      <h1 className="font-display text-2xl md:text-5xl tracking-wide mb-4 md:mb-8" style={{ color: '#F5F5F0' }}>Add New Product</h1>
      <ProductForm />
    </div>
  )
}
