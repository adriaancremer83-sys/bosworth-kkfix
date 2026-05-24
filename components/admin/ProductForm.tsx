'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Loader2, CheckCircle, AlertCircle, X, PlusCircle } from 'lucide-react'
import type { ProductWithRelations, Instruction, KitContent, SafetyItem, TechSpec } from '@/lib/types'
import KitContentsEditor from './KitContentsEditor'
import InstructionsEditor from './InstructionsEditor'
import SafetyEditor from './SafetyEditor'
import TechSpecsEditor, { EditableTechSpec } from './TechSpecsEditor'
import ImageUpload from './ImageUpload'

type EditableInstruction = Partial<Instruction> & { _key: string }
type EditableKitContent = Partial<KitContent> & { _key: string }
type EditableSafetyItem = Partial<SafetyItem> & { _key: string }

interface ProductFormProps {
  product?: ProductWithRelations
}

const TABS = ['Basic Info', 'Kit Contents', 'Instructions', 'Safety Info', 'Tech Specs']

const ORANGE = '#CC1F28'
const BORDER = '#383838'

const inputStyle: React.CSSProperties = {
  background: '#1C1C1C',
  border: `1px solid ${BORDER}`,
  color: '#F5F5F0',
  borderRadius: '6px',
  padding: '10px 14px',
  fontSize: '14px',
  outline: 'none',
  width: '100%',
  fontFamily: 'Inter, sans-serif',
}

function slugify(s: string) {
  return s.toLowerCase().replace(/[^a-z0-9\s-]/g, '').replace(/\s+/g, '-').replace(/-+/g, '-').trim()
}

// --- Badge editor ---
function BadgeEditor({ badges, onChange }: { badges: string[]; onChange: (b: string[]) => void }) {
  const [input, setInput] = useState('')

  function addBadge() {
    const v = input.trim().toUpperCase()
    if (v && !badges.includes(v)) onChange([...badges, v])
    setInput('')
  }

  return (
    <div>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '8px' }}>
        {badges.map(b => (
          <span key={b} style={{
            background: 'rgba(232,101,10,0.1)', border: '1px solid rgba(232,101,10,0.3)',
            color: '#CC1F28', padding: '4px 10px', fontSize: '11px', letterSpacing: '1px',
            display: 'flex', alignItems: 'center', gap: '6px',
          }}>
            {b}
            <button type="button" onClick={() => onChange(badges.filter(x => x !== b))}
              style={{ background: 'none', border: 'none', color: '#CC1F28', cursor: 'pointer', padding: 0, lineHeight: 1 }}>
              <X size={10} />
            </button>
          </span>
        ))}
        {badges.length === 0 && <span style={{ fontSize: '12px', color: '#555' }}>No badges yet</span>}
      </div>
      <div style={{ display: 'flex', gap: '8px' }}>
        <input
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); addBadge() } }}
          placeholder="e.g. FIRE RETARDANT"
          style={{ ...inputStyle, fontSize: '13px', padding: '8px 12px', flex: 1 }}
          onFocus={e => { e.currentTarget.style.borderColor = ORANGE }}
          onBlur={e => { e.currentTarget.style.borderColor = BORDER }}
        />
        <button type="button" onClick={addBadge}
          style={{
            background: 'transparent', border: `1px solid ${BORDER}`, color: '#8A8A8A',
            padding: '8px 14px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px', fontSize: '12px', borderRadius: '6px',
          }}
          onMouseEnter={e => { e.currentTarget.style.borderColor = ORANGE; e.currentTarget.style.color = ORANGE }}
          onMouseLeave={e => { e.currentTarget.style.borderColor = BORDER; e.currentTarget.style.color = '#8A8A8A' }}>
          <PlusCircle size={13} /> Add
        </button>
      </div>
      <p style={{ fontSize: '11px', color: '#555', marginTop: '4px' }}>Press Enter or click Add. Displayed as chips in the hero.</p>
    </div>
  )
}

// --- Gallery editor (up to 6) ---
function GalleryEditor({ images, onChange }: { images: string[]; onChange: (imgs: string[]) => void }) {
  function update(index: number, url: string | null) {
    const next = [...images]
    if (url === null) {
      next.splice(index, 1)
    } else {
      next[index] = url
    }
    onChange(next)
  }

  function addSlot(url: string | null) {
    if (url) onChange([...images, url])
  }

  const slots = images.slice(0, 6)
  const canAdd = slots.length < 6

  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px' }}>
      {slots.map((img, i) => (
        <ImageUpload
          key={i}
          value={img}
          onChange={url => update(i, url)}
          bucket="product-images"
          width={140}
          aspectRatio="4/3"
        />
      ))}
      {canAdd && (
        <ImageUpload
          value={null}
          onChange={addSlot}
          bucket="product-images"
          width={140}
          aspectRatio="4/3"
          label={images.length === 0 ? 'Add Gallery Image' : undefined}
        />
      )}
      {slots.length === 0 && (
        <p style={{ fontSize: '12px', color: '#555' }}>Up to 6 gallery images</p>
      )}
    </div>
  )
}

export default function ProductForm({ product }: ProductFormProps) {
  const router = useRouter()
  const isEdit = !!product

  const [activeTab, setActiveTab] = useState(0)
  const [loading, setLoading] = useState(false)
  const [toast, setToast] = useState<{ type: 'success' | 'error'; message: string } | null>(null)

  // Basic info
  const [name, setName] = useState(product?.name ?? '')
  const [slug, setSlug] = useState(product?.slug ?? '')
  const [subtitle, setSubtitle] = useState(product?.subtitle ?? '')
  const [partNumber, setPartNumber] = useState(product?.part_number ?? '')
  const [version, setVersion] = useState(product?.version ?? '')
  const [category, setCategory] = useState(product?.category ?? 'Repair Kits')
  const [tagline, setTagline] = useState(product?.tagline ?? '')
  const [description, setDescription] = useState(product?.description ?? '')
  const [badges, setBadges] = useState<string[]>(product?.badges ?? [])
  const [heroImageUrl, setHeroImageUrl] = useState<string | null>(product?.hero_image_url ?? null)
  const [productImageUrl, setProductImageUrl] = useState<string | null>(product?.product_image_url ?? null)
  const [galleryImages, setGalleryImages] = useState<string[]>(product?.gallery_images ?? [])
  const [videoUrl, setVideoUrl] = useState(product?.video_url ?? '')
  const [msdsUrl, setMsdsUrl] = useState(product?.msds_url ?? '')
  const [isActive, setIsActive] = useState(product?.is_active ?? true)
  const [slugManual, setSlugManual] = useState(isEdit)

  // Relations
  const [kitContents, setKitContents] = useState<EditableKitContent[]>(
    (product?.kit_contents ?? []).map(i => ({ ...i, _key: i.id }))
  )
  const [instructions, setInstructions] = useState<EditableInstruction[]>(
    (product?.instructions ?? []).map(i => ({ ...i, _key: i.id }))
  )
  const [safetyItems, setSafetyItems] = useState<EditableSafetyItem[]>(
    (product?.safety_items ?? []).map(i => ({ ...i, _key: i.id }))
  )
  const [techSpecs, setTechSpecs] = useState<EditableTechSpec[]>(
    (product?.tech_specs ?? []).map(s => ({ _key: s.id, key: s.key, value: s.value }))
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
      const productData = {
        name: name.trim(),
        slug: slug.trim(),
        subtitle: subtitle || null,
        part_number: partNumber || null,
        version: version || null,
        category: category || null,
        tagline: tagline || null,
        description: description || null,
        badges: badges.length > 0 ? badges : null,
        hero_image_url: heroImageUrl,
        product_image_url: productImageUrl,
        gallery_images: galleryImages.length > 0 ? galleryImages : null,
        video_url: videoUrl || null,
        msds_url: msdsUrl || null,
        is_active: isActive,
      }

      const kitContentsData = kitContents.map((item, i) => ({
        item_name: item.item_name ?? '',
        item_description: item.item_description ?? null,
        quantity: item.quantity ?? null,
        image_url: item.image_url ?? null,
        sort_order: i,
      }))

      const instructionsData = instructions.map((item, i) => ({
        step_number: i + 1,
        title: item.title ?? '',
        description: item.description ?? '',
        warning: item.warning ?? null,
        image_url: item.image_url ?? null,
        estimated_time: item.estimated_time ?? null,
      }))

      const safetyItemsData = safetyItems.map((item, i) => ({
        icon: item.icon ?? 'alert-triangle',
        label: item.label ?? '',
        description: item.description ?? null,
        type: item.type ?? 'warning',
        sort_order: i,
      }))

      const techSpecsData = techSpecs
        .filter(s => s.key?.trim() && s.value?.trim())
        .map((s, i) => ({ key: s.key, value: s.value, sort_order: i }))

      let productId = product?.id

      if (isEdit && productId) {
        const res = await fetch(`/api/admin/products/${productId}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            product: productData,
            kit_contents: kitContentsData,
            instructions: instructionsData,
            safety_items: safetyItemsData,
            tech_specs: techSpecsData,
          }),
        })
        if (!res.ok) {
          const json = await res.json()
          throw new Error(json.error ?? 'Update failed')
        }
      } else {
        const res = await fetch('/api/admin/products', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            product: productData,
            kit_contents: kitContentsData,
            instructions: instructionsData,
            safety_items: safetyItemsData,
            tech_specs: techSpecsData,
          }),
        })
        if (!res.ok) {
          const json = await res.json()
          throw new Error(json.error ?? 'Create failed')
        }
        const json = await res.json()
        productId = json.id
      }

      showToast('success', isEdit ? 'Product updated.' : 'Product created.')
      if (!isEdit && productId) {
        setTimeout(() => router.push(`/admin/products/${productId}`), 1500)
      }
    } catch (err) {
      showToast('error', err instanceof Error ? err.message : 'An error occurred.')
    } finally {
      setLoading(false)
    }
  }

  function field(label: string, node: React.ReactNode, hint?: string) {
    return (
      <div>
        <label className="block text-xs mb-1.5 uppercase tracking-wide" style={{ color: '#8A8A8A' }}>{label}</label>
        {node}
        {hint && <p className="text-xs mt-1" style={{ color: '#555' }}>{hint}</p>}
      </div>
    )
  }

  function inp(value: string, setter: (v: string) => void, placeholder?: string, extraOnChange?: () => void) {
    return (
      <input value={value} onChange={e => { setter(e.target.value); extraOnChange?.() }} placeholder={placeholder} style={inputStyle}
        onFocus={e => { e.currentTarget.style.borderColor = ORANGE }}
        onBlur={e => { e.currentTarget.style.borderColor = BORDER }} />
    )
  }

  return (
    <div>
      {/* Tabs */}
      <div className="mb-8 border-b overflow-x-auto" style={{ borderColor: BORDER }}>
        <div className="flex gap-0 whitespace-nowrap">
          {TABS.map((tab, i) => (
            <button key={tab} type="button" onClick={() => setActiveTab(i)}
              className="px-4 md:px-5 py-3 text-sm font-medium transition-colors relative flex-shrink-0"
              style={{ color: activeTab === i ? '#F5F5F0' : '#8A8A8A', background: 'transparent', border: 'none', cursor: 'pointer' }}>
              {tab}
              {activeTab === i && <span className="absolute bottom-0 left-0 right-0 h-0.5" style={{ background: ORANGE }} />}
            </button>
          ))}
        </div>
      </div>

      <div className="mb-24">

        {/* ── TAB 0: Basic Info ── */}
        {activeTab === 0 && (
          <div className="max-w-3xl flex flex-col gap-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {field('Product Name *', inp(name, setName, 'e.g. KK-FIX'))}
              {field('Slug *',
                <input value={slug} onChange={e => { setSlugManual(true); setSlug(e.target.value) }} placeholder="e.g. kk-fix" style={inputStyle}
                  onFocus={e => { e.currentTarget.style.borderColor = ORANGE }}
                  onBlur={e => { e.currentTarget.style.borderColor = BORDER }} />,
                `Available at: /products/${slug || '…'}`
              )}
              {field('Part Number', inp(partNumber, setPartNumber, 'e.g. BSW-KKF-500'))}
              {field('Version', inp(version, setVersion, 'e.g. Version 2'))}
              {field('Category',
                <select value={category} onChange={e => setCategory(e.target.value)} style={inputStyle}>
                  <option value="Repair Kits">Repair Kits</option>
                  <option value="Adhesives">Adhesives</option>
                  <option value="Tools">Tools</option>
                  <option value="Other">Other</option>
                </select>
              )}
              <div className="flex items-center gap-3 pt-5">
                <label className="text-xs uppercase tracking-wide" style={{ color: '#8A8A8A' }}>Active</label>
                <button type="button" onClick={() => setIsActive(!isActive)}
                  className="relative w-12 h-6 rounded-full transition-colors"
                  style={{ background: isActive ? ORANGE : BORDER }}>
                  <span className="absolute top-1 left-1 w-4 h-4 rounded-full bg-white transition-transform"
                    style={{ transform: isActive ? 'translateX(24px)' : 'translateX(0)' }} />
                </button>
                <span className="text-xs" style={{ color: isActive ? ORANGE : '#8A8A8A' }}>
                  {isActive ? 'Published' : 'Hidden'}
                </span>
              </div>
            </div>

            {field('Tagline', inp(tagline, setTagline, 'Short product tagline shown in hero'), 'Displayed large under the KK-FIX wordmark')}
            {field('Subtitle', inp(subtitle, setSubtitle, 'Optional second line under tagline'))}
            {field('Description',
              <textarea rows={4} value={description} onChange={e => setDescription(e.target.value)}
                placeholder="Full product description" style={{ ...inputStyle, resize: 'vertical' }}
                onFocus={e => { e.currentTarget.style.borderColor = ORANGE }}
                onBlur={e => { e.currentTarget.style.borderColor = BORDER }} />
            )}

            {field('Badge Labels', <BadgeEditor badges={badges} onChange={setBadges} />)}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {field('Video URL', inp(videoUrl, setVideoUrl, 'YouTube embed URL'), 'Use the YouTube embed URL format')}
              {field('MSDS / SDS PDF URL', inp(msdsUrl, setMsdsUrl, 'https://…/sds.pdf'))}
            </div>

            {/* Image uploads */}
            <div>
              <p className="text-xs mb-3 uppercase tracking-wide" style={{ color: '#8A8A8A' }}>Product Images</p>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '24px' }}>
                <ImageUpload
                  value={heroImageUrl}
                  onChange={setHeroImageUrl}
                  bucket="product-images"
                  label="Hero Background"
                  width={240}
                  aspectRatio="16/9"
                />
                <ImageUpload
                  value={productImageUrl}
                  onChange={setProductImageUrl}
                  bucket="product-images"
                  label="Product Photo"
                  width={200}
                  aspectRatio="1/1"
                />
              </div>
            </div>

            {field('Gallery Images (up to 6)',
              <GalleryEditor images={galleryImages} onChange={setGalleryImages} />
            )}
          </div>
        )}

        {/* ── TAB 1: Kit Contents ── */}
        {activeTab === 1 && (
          <div className="max-w-4xl">
            <KitContentsEditor items={kitContents} onChange={setKitContents} />
          </div>
        )}

        {/* ── TAB 2: Instructions ── */}
        {activeTab === 2 && (
          <div className="max-w-3xl">
            <InstructionsEditor items={instructions} onChange={setInstructions} />
          </div>
        )}

        {/* ── TAB 3: Safety Info ── */}
        {activeTab === 3 && (
          <div className="max-w-4xl">
            <SafetyEditor items={safetyItems} onChange={setSafetyItems} />
          </div>
        )}

        {/* ── TAB 4: Tech Specs ── */}
        {activeTab === 4 && (
          <div className="max-w-2xl">
            <p className="text-sm mb-6" style={{ color: '#8A8A8A' }}>
              Add key-value specification rows. These display as a monospace table on the product page.
            </p>
            <TechSpecsEditor items={techSpecs} onChange={setTechSpecs} />
          </div>
        )}

      </div>

      {/* Save bar */}
      <div className="fixed bottom-0 left-0 md:left-[260px] right-0 px-4 md:px-8 py-4 flex items-center justify-between"
        style={{ background: '#0F0F0F', borderTop: `1px solid ${BORDER}`, zIndex: 10 }}>
        <button type="button" onClick={() => router.push('/admin/products')}
          className="px-5 py-2.5 rounded text-sm"
          style={{ color: '#8A8A8A', border: `1px solid ${BORDER}`, background: 'transparent', cursor: 'pointer' }}>
          Cancel
        </button>
        <button type="button" onClick={loading ? undefined : handleSave}
          className="flex items-center gap-2 px-6 py-2.5 rounded text-sm font-medium"
          style={{
            backgroundColor: loading ? BORDER : ORANGE,
            color: loading ? '#8A8A8A' : '#fff',
            cursor: loading ? 'not-allowed' : 'pointer',
            border: 'none',
          }}>
          {loading
            ? <><Loader2 size={14} className="animate-spin" />Saving…</>
            : `${isEdit ? 'Update' : 'Create'} Product`}
        </button>
      </div>

      {/* Toast */}
      {toast && (
        <div className="fixed bottom-20 right-4 md:right-8 flex items-center gap-2 px-4 py-3 rounded-lg shadow-lg z-50"
          style={{
            background: toast.type === 'success' ? 'rgba(34,197,94,0.12)' : 'rgba(232,101,10,0.12)',
            border: `1px solid ${toast.type === 'success' ? 'rgba(34,197,94,0.4)' : 'rgba(232,101,10,0.4)'}`,
          }}>
          {toast.type === 'success'
            ? <CheckCircle size={14} style={{ color: '#22c55e' }} />
            : <AlertCircle size={14} style={{ color: ORANGE }} />}
          <p className="text-sm" style={{ color: toast.type === 'success' ? '#22c55e' : ORANGE }}>
            {toast.message}
          </p>
        </div>
      )}
    </div>
  )
}
