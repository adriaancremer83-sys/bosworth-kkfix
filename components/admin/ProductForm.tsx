'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Loader2, CheckCircle, AlertCircle } from 'lucide-react'
import { createProduct, updateProduct, upsertInstructions, upsertKitContents, upsertSafetyItems } from '@/lib/products'
import type { ProductWithRelations, Instruction, KitContent, SafetyItem } from '@/lib/types'
import KitContentsEditor from './KitContentsEditor'
import InstructionsEditor from './InstructionsEditor'
import SafetyEditor from './SafetyEditor'

type EditableInstruction = Partial<Instruction> & { _key: string }
type EditableKitContent = Partial<KitContent> & { _key: string }
type EditableSafetyItem = Partial<SafetyItem> & { _key: string }

interface ProductFormProps {
  product?: ProductWithRelations
}

const tabs = ['Basic Info', 'Kit Contents', 'Instructions', 'Safety Info']

const inputStyle = {
  background: '#1C1C1C',
  border: '1px solid #383838',
  color: '#F5F5F0',
  borderRadius: '6px',
  padding: '10px 14px',
  fontSize: '14px',
  outline: 'none',
  width: '100%',
  fontFamily: 'DM Sans, sans-serif',
}

function slugify(s: string) {
  return s.toLowerCase().replace(/[^a-z0-9\s-]/g, '').replace(/\s+/g, '-').replace(/-+/g, '-').trim()
}

export default function ProductForm({ product }: ProductFormProps) {
  const router = useRouter()
  const isEdit = !!product

  const [activeTab, setActiveTab] = useState(0)
  const [loading, setLoading] = useState(false)
  const [toast, setToast] = useState<{ type: 'success' | 'error'; message: string } | null>(null)

  const [name, setName] = useState(product?.name ?? '')
  const [slug, setSlug] = useState(product?.slug ?? '')
  const [partNumber, setPartNumber] = useState(product?.part_number ?? '')
  const [category, setCategory] = useState(product?.category ?? 'Repair Kits')
  const [tagline, setTagline] = useState(product?.tagline ?? '')
  const [description, setDescription] = useState(product?.description ?? '')
  const [imageUrl, setImageUrl] = useState(product?.image_url ?? '')
  const [videoUrl, setVideoUrl] = useState(product?.video_url ?? '')
  const [msdsUrl, setMsdsUrl] = useState(product?.msds_url ?? '')
  const [isActive, setIsActive] = useState(product?.is_active ?? true)
  const [slugManual, setSlugManual] = useState(isEdit)

  const [kitContents, setKitContents] = useState<EditableKitContent[]>(
    (product?.kit_contents ?? []).map(i => ({ ...i, _key: i.id }))
  )
  const [instructions, setInstructions] = useState<EditableInstruction[]>(
    (product?.instructions ?? []).map(i => ({ ...i, _key: i.id }))
  )
  const [safetyItems, setSafetyItems] = useState<EditableSafetyItem[]>(
    (product?.safety_items ?? []).map(i => ({ ...i, _key: i.id }))
  )

  useEffect(() => {
    if (!slugManual) setSlug(slugify(name))
  }, [name, slugManual])

  function showToast(type: 'success' | 'error', message: string) {
    setToast({ type, message })
    setTimeout(() => setToast(null), 4000)
  }

  async function handleSave() {
    if (!name.trim()) { showToast('error', 'Product name is required.'); return }
    if (!slug.trim()) { showToast('error', 'Slug is required.'); return }

    setLoading(true)
    try {
      const data = {
        name: name.trim(),
        slug: slug.trim(),
        part_number: partNumber || null,
        category: category || null,
        tagline: tagline || null,
        description: description || null,
        image_url: imageUrl || null,
        video_url: videoUrl || null,
        msds_url: msdsUrl || null,
        is_active: isActive,
      }

      let productId = product?.id
      if (isEdit && productId) {
        await updateProduct(productId, data)
      } else {
        const created = await createProduct(data)
        productId = created.id
      }

      if (productId) {
        await upsertKitContents(productId, kitContents.map((item, i) => ({ ...item, sort_order: i })))
        await upsertInstructions(productId, instructions.map((item, i) => ({ ...item, step_number: i + 1 })))
        await upsertSafetyItems(productId, safetyItems.map((item, i) => ({ ...item, sort_order: i })))
      }

      showToast('success', isEdit ? 'Product updated successfully.' : 'Product created successfully.')
      if (!isEdit && productId) {
        setTimeout(() => router.push(`/admin/products/${productId}`), 1500)
      }
    } catch (err) {
      showToast('error', err instanceof Error ? err.message : 'An error occurred.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      <div className="flex gap-0 mb-8 border-b" style={{ borderColor: '#383838' }}>
        {tabs.map((tab, i) => (
          <button
            key={tab}
            type="button"
            onClick={() => setActiveTab(i)}
            className="px-5 py-3 text-sm font-medium transition-colors relative"
            style={{ color: activeTab === i ? '#F5F5F0' : '#8A8A8A', background: 'transparent', border: 'none' }}>
            {tab}
            {activeTab === i && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5" style={{ background: '#C8102E' }} />
            )}
          </button>
        ))}
      </div>

      <div className="mb-24">
        {activeTab === 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 max-w-3xl">
            {[
              { label: 'Product Name *', value: name, onChange: (v: string) => setName(v), placeholder: 'e.g. KK-FIX' },
            ].map(f => (
              <div key={f.label}>
                <label className="block text-xs mb-1.5 uppercase tracking-wide" style={{ color: '#8A8A8A' }}>{f.label}</label>
                <input value={f.value} onChange={e => f.onChange(e.target.value)} placeholder={f.placeholder} style={inputStyle}
                  onFocus={e => { e.currentTarget.style.borderColor = '#C8102E' }}
                  onBlur={e => { e.currentTarget.style.borderColor = '#383838' }} />
              </div>
            ))}

            <div>
              <label className="block text-xs mb-1.5 uppercase tracking-wide" style={{ color: '#8A8A8A' }}>Slug *</label>
              <input
                value={slug}
                onChange={e => { setSlugManual(true); setSlug(e.target.value) }}
                placeholder="e.g. kk-fix"
                style={inputStyle}
                onFocus={e => { e.currentTarget.style.borderColor = '#C8102E' }}
                onBlur={e => { e.currentTarget.style.borderColor = '#383838' }}
              />
              <p className="text-xs mt-1" style={{ color: '#8A8A8A' }}>
                Available at: /products/<span style={{ color: '#C8102E' }}>{slug || '…'}</span>
              </p>
            </div>

            <div>
              <label className="block text-xs mb-1.5 uppercase tracking-wide" style={{ color: '#8A8A8A' }}>Part Number</label>
              <input value={partNumber} onChange={e => setPartNumber(e.target.value)} placeholder="e.g. BSW-KKF-500" style={inputStyle}
                onFocus={e => { e.currentTarget.style.borderColor = '#C8102E' }}
                onBlur={e => { e.currentTarget.style.borderColor = '#383838' }} />
            </div>

            <div>
              <label className="block text-xs mb-1.5 uppercase tracking-wide" style={{ color: '#8A8A8A' }}>Category</label>
              <select value={category} onChange={e => setCategory(e.target.value)} style={inputStyle}>
                <option value="Repair Kits">Repair Kits</option>
                <option value="Adhesives">Adhesives</option>
                <option value="Tools">Tools</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div className="md:col-span-2">
              <label className="block text-xs mb-1.5 uppercase tracking-wide" style={{ color: '#8A8A8A' }}>Tagline</label>
              <input value={tagline} onChange={e => setTagline(e.target.value)} placeholder="Short product tagline" style={inputStyle}
                onFocus={e => { e.currentTarget.style.borderColor = '#C8102E' }}
                onBlur={e => { e.currentTarget.style.borderColor = '#383838' }} />
            </div>

            <div className="md:col-span-2">
              <label className="block text-xs mb-1.5 uppercase tracking-wide" style={{ color: '#8A8A8A' }}>Description</label>
              <textarea rows={4} value={description} onChange={e => setDescription(e.target.value)}
                placeholder="Full product description" style={{ ...inputStyle, resize: 'vertical' }}
                onFocus={e => { e.currentTarget.style.borderColor = '#C8102E' }}
                onBlur={e => { e.currentTarget.style.borderColor = '#383838' }} />
            </div>

            <div>
              <label className="block text-xs mb-1.5 uppercase tracking-wide" style={{ color: '#8A8A8A' }}>Image URL</label>
              <input value={imageUrl} onChange={e => setImageUrl(e.target.value)} placeholder="https://…" style={inputStyle}
                onFocus={e => { e.currentTarget.style.borderColor = '#C8102E' }}
                onBlur={e => { e.currentTarget.style.borderColor = '#383838' }} />
            </div>

            <div>
              <label className="block text-xs mb-1.5 uppercase tracking-wide" style={{ color: '#8A8A8A' }}>Video URL</label>
              <input value={videoUrl} onChange={e => setVideoUrl(e.target.value)} placeholder="YouTube embed URL" style={inputStyle}
                onFocus={e => { e.currentTarget.style.borderColor = '#C8102E' }}
                onBlur={e => { e.currentTarget.style.borderColor = '#383838' }} />
              <p className="text-xs mt-1" style={{ color: '#8A8A8A' }}>Use the YouTube embed URL format</p>
            </div>

            <div>
              <label className="block text-xs mb-1.5 uppercase tracking-wide" style={{ color: '#8A8A8A' }}>MSDS PDF URL</label>
              <input value={msdsUrl} onChange={e => setMsdsUrl(e.target.value)} placeholder="https://…/msds.pdf" style={inputStyle}
                onFocus={e => { e.currentTarget.style.borderColor = '#C8102E' }}
                onBlur={e => { e.currentTarget.style.borderColor = '#383838' }} />
            </div>

            <div className="flex items-center gap-3">
              <label className="block text-xs uppercase tracking-wide" style={{ color: '#8A8A8A' }}>Active</label>
              <button
                type="button"
                onClick={() => setIsActive(!isActive)}
                className="relative w-12 h-6 rounded-full transition-colors"
                style={{ background: isActive ? '#C8102E' : '#383838' }}>
                <span className="absolute top-1 left-1 w-4 h-4 rounded-full bg-white transition-transform"
                  style={{ transform: isActive ? 'translateX(24px)' : 'translateX(0)' }} />
              </button>
              <span className="text-xs" style={{ color: isActive ? '#C8102E' : '#8A8A8A' }}>
                {isActive ? 'Published' : 'Hidden'}
              </span>
            </div>
          </div>
        )}

        {activeTab === 1 && (
          <div className="max-w-4xl">
            <KitContentsEditor items={kitContents} onChange={setKitContents} />
          </div>
        )}

        {activeTab === 2 && (
          <div className="max-w-3xl">
            <InstructionsEditor items={instructions} onChange={setInstructions} />
          </div>
        )}

        {activeTab === 3 && (
          <div className="max-w-4xl">
            <SafetyEditor items={safetyItems} onChange={setSafetyItems} />
          </div>
        )}
      </div>

      <div className="fixed bottom-0 left-[260px] right-0 px-8 py-4 flex items-center justify-between"
        style={{ background: '#0F0F0F', borderTop: '1px solid #383838', zIndex: 10 }}>
        <button
          type="button"
          onClick={() => router.push('/admin/products')}
          className="px-5 py-2.5 rounded text-sm"
          style={{ color: '#8A8A8A', border: '1px solid #383838', background: 'transparent' }}>
          Cancel
        </button>
        <button
          type="button"
          onClick={handleSave}
          disabled={loading}
          className="flex items-center gap-2 px-6 py-2.5 rounded text-sm font-medium"
          style={{ background: loading ? '#383838' : '#C8102E', color: '#F5F5F0' }}>
          {loading ? <><Loader2 size={14} className="animate-spin" />Saving…</> : `${isEdit ? 'Update' : 'Create'} Product`}
        </button>
      </div>

      {toast && (
        <div className="fixed bottom-20 right-8 flex items-center gap-2 px-4 py-3 rounded-lg shadow-lg z-50"
          style={{
            background: toast.type === 'success' ? 'rgba(22,163,74,0.15)' : 'rgba(200,16,46,0.15)',
            border: `1px solid ${toast.type === 'success' ? 'rgba(22,163,74,0.4)' : 'rgba(200,16,46,0.4)'}`,
          }}>
          {toast.type === 'success'
            ? <CheckCircle size={14} style={{ color: '#16A34A' }} />
            : <AlertCircle size={14} style={{ color: '#C8102E' }} />}
          <p className="text-sm" style={{ color: toast.type === 'success' ? '#16A34A' : '#C8102E' }}>{toast.message}</p>
        </div>
      )}
    </div>
  )
}
