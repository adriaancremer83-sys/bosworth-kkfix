import ProductForm from '@/components/admin/ProductForm'

export default function NewProductPage() {
  return (
    <div>
      <h1 style={{ fontSize: '28px', fontWeight: 700, color: '#F5F5F0', lineHeight: 1, marginBottom: '32px' }}>Add New Product</h1>
      <ProductForm />
    </div>
  )
}
