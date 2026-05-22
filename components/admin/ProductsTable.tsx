'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Pencil, QrCode, Eye, EyeOff, Trash2, Loader2 } from 'lucide-react'
import type { Product } from '@/lib/types'

interface ProductsTableProps {
  initialProducts: Product[]
}

export default function ProductsTable({ initialProducts }: ProductsTableProps) {
  const [products, setProducts] = useState(initialProducts)
  const [loadingId, setLoadingId] = useState<string | null>(null)
  const router = useRouter()

  async function handleToggle(product: Product) {
    setLoadingId(product.id)
    try {
      const res = await fetch(`/api/admin/products/${product.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ product: { is_active: !product.is_active } }),
      })
      if (!res.ok) throw new Error('Toggle failed')
      setProducts(prev => prev.map(p => p.id === product.id ? { ...p, is_active: !p.is_active } : p))
    } finally {
      setLoadingId(null)
    }
  }

  async function handleDelete(product: Product) {
    if (!confirm(`Delete "${product.name}"? This cannot be undone.`)) return
    setLoadingId(product.id)
    try {
      const res = await fetch(`/api/admin/products/${product.id}`, { method: 'DELETE' })
      if (!res.ok) throw new Error('Delete failed')
      setProducts(prev => prev.filter(p => p.id !== product.id))
    } finally {
      setLoadingId(null)
      router.refresh()
    }
  }

  const headerCell = 'px-4 py-3 text-left text-xs font-medium uppercase tracking-wider'
  const cell = 'px-4 py-4 text-sm'

  const actionIcons = (product: Product) => (
    <div className="flex items-center gap-2">
      <Link href={`/admin/products/${product.id}`} title="Edit"
        className="p-1.5 rounded transition-colors"
        style={{ color: '#60a5fa' }}
        onMouseEnter={e => { e.currentTarget.style.background = 'rgba(96,165,250,0.1)' }}
        onMouseLeave={e => { e.currentTarget.style.background = 'transparent' }}>
        <Pencil size={14} />
      </Link>
      <Link href={`/admin/qr?product=${product.id}`} title="Generate QR"
        className="p-1.5 rounded transition-colors"
        style={{ color: '#a78bfa' }}
        onMouseEnter={e => { e.currentTarget.style.background = 'rgba(167,139,250,0.1)' }}
        onMouseLeave={e => { e.currentTarget.style.background = 'transparent' }}>
        <QrCode size={14} />
      </Link>
      <button
        onClick={() => handleToggle(product)}
        disabled={loadingId === product.id}
        title={product.is_active ? 'Deactivate' : 'Activate'}
        className="p-1.5 rounded transition-colors"
        style={{ color: '#8A8A8A' }}
        onMouseEnter={e => { e.currentTarget.style.background = 'rgba(138,138,138,0.1)' }}
        onMouseLeave={e => { e.currentTarget.style.background = 'transparent' }}>
        {loadingId === product.id ? <Loader2 size={14} className="animate-spin" /> : product.is_active ? <Eye size={14} /> : <EyeOff size={14} />}
      </button>
      <button
        onClick={() => handleDelete(product)}
        disabled={loadingId === product.id}
        title="Delete"
        className="p-1.5 rounded transition-colors"
        style={{ color: '#E8650A' }}
        onMouseEnter={e => { e.currentTarget.style.background = 'rgba(200,16,46,0.1)' }}
        onMouseLeave={e => { e.currentTarget.style.background = 'transparent' }}>
        <Trash2 size={14} />
      </button>
    </div>
  )

  const statusBadge = (product: Product) => (
    <span className="px-2 py-0.5 rounded text-xs font-medium"
      style={{
        background: product.is_active ? 'rgba(22,163,74,0.15)' : 'rgba(56,56,56,0.5)',
        color: product.is_active ? '#16A34A' : '#8A8A8A',
        border: `1px solid ${product.is_active ? 'rgba(22,163,74,0.3)' : '#383838'}`,
      }}>
      {product.is_active ? 'Active' : 'Inactive'}
    </span>
  )

  return (
    <>
      {/* Mobile cards */}
      <div className="flex flex-col gap-3 md:hidden">
        {products.map(product => (
          <div key={product.id} className="rounded-lg p-4"
            style={{ background: '#1C1C1C', border: '1px solid #383838' }}>
            <div className="flex items-start justify-between gap-2 mb-2">
              <p className="text-base font-semibold" style={{ color: '#F5F5F0' }}>{product.name}</p>
              {statusBadge(product)}
            </div>
            <p className="text-xs mb-3" style={{ color: '#8A8A8A', fontFamily: 'monospace' }}>
              {[product.part_number, product.category].filter(Boolean).join(' · ') || '—'}
            </p>
            <div className="flex items-center justify-between">
              <p className="text-xs" style={{ color: '#555' }}>{new Date(product.created_at).toLocaleDateString()}</p>
              {actionIcons(product)}
            </div>
          </div>
        ))}
      </div>

      {/* Desktop table */}
      <div className="hidden md:block rounded-lg overflow-hidden" style={{ border: '1px solid #383838' }}>
        <table className="w-full">
          <thead style={{ background: '#242424' }}>
            <tr>
              {['Name', 'Part No', 'Category', 'Status', 'Created', 'Actions'].map(h => (
                <th key={h} className={headerCell} style={{ color: '#8A8A8A' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody style={{ background: '#1C1C1C' }}>
            {products.map(product => (
              <tr
                key={product.id}
                style={{ borderTop: '1px solid #242424' }}
                onMouseEnter={e => { e.currentTarget.style.background = '#242424' }}
                onMouseLeave={e => { e.currentTarget.style.background = 'transparent' }}>
                <td className={cell} style={{ color: '#F5F5F0', fontWeight: 500 }}>{product.name}</td>
                <td className={cell} style={{ color: '#8A8A8A', fontFamily: 'monospace' }}>{product.part_number ?? '—'}</td>
                <td className={cell} style={{ color: '#8A8A8A' }}>{product.category ?? '—'}</td>
                <td className={cell}>{statusBadge(product)}</td>
                <td className={cell} style={{ color: '#8A8A8A' }}>{new Date(product.created_at).toLocaleDateString()}</td>
                <td className={cell}>{actionIcons(product)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  )
}
