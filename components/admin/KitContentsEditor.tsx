'use client'

import { GripVertical, X, PlusCircle, ChevronUp, ChevronDown } from 'lucide-react'
import type { KitContent } from '@/lib/types'
import ImageUpload from './ImageUpload'

type EditableKitContent = Partial<KitContent> & { _key: string }

interface KitContentsEditorProps {
  items: EditableKitContent[]
  onChange: (items: EditableKitContent[]) => void
}

const inputStyle: React.CSSProperties = {
  background: '#0A0A0A',
  border: '1px solid #383838',
  color: '#F5F5F0',
  padding: '8px 12px',
  fontSize: '13px',
  outline: 'none',
  width: '100%',
  fontFamily: 'Inter, sans-serif',
}

export default function KitContentsEditor({ items, onChange }: KitContentsEditorProps) {
  function add() {
    onChange([...items, { _key: crypto.randomUUID(), item_name: '', item_description: '', quantity: '', image_url: null, sort_order: items.length }])
  }

  function update(key: string, field: keyof EditableKitContent, value: string | null) {
    onChange(items.map(item => item._key === key ? { ...item, [field]: value } : item))
  }

  function remove(key: string) {
    onChange(items.filter(item => item._key !== key))
  }

  function moveUp(index: number) {
    if (index === 0) return
    const next = [...items]
    ;[next[index - 1], next[index]] = [next[index], next[index - 1]]
    onChange(next)
  }

  function moveDown(index: number) {
    if (index === items.length - 1) return
    const next = [...items]
    ;[next[index], next[index + 1]] = [next[index + 1], next[index]]
    onChange(next)
  }

  return (
    <div>
      <div className="flex flex-col gap-3 mb-4">
        {items.length === 0 && (
          <p className="text-sm py-4 text-center" style={{ color: '#8A8A8A' }}>No kit contents yet. Add items below.</p>
        )}
        {items.map((item, i) => (
          <div key={item._key} className="p-4 rounded-lg" style={{ background: '#0A0A0A', border: '1px solid #383838' }}>
            <div className="flex items-center gap-2 mb-3">
              <GripVertical size={16} className="flex-shrink-0" style={{ color: '#383838' }} />
              <span className="font-display text-lg flex-shrink-0 w-6 text-center" style={{ color: '#E8650A' }}>
                {String(i + 1).padStart(2, '0')}
              </span>
              <div className="flex items-center gap-1 ml-auto">
                <button type="button" onClick={() => moveUp(i)} className="p-1" style={{ color: '#8A8A8A', background: 'none', border: 'none', cursor: 'pointer' }}>
                  <ChevronUp size={14} />
                </button>
                <button type="button" onClick={() => moveDown(i)} className="p-1" style={{ color: '#8A8A8A', background: 'none', border: 'none', cursor: 'pointer' }}>
                  <ChevronDown size={14} />
                </button>
                <button type="button" onClick={() => remove(item._key!)} className="p-1" style={{ color: '#E8650A', background: 'none', border: 'none', cursor: 'pointer' }}>
                  <X size={14} />
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 mb-3">
              <input
                placeholder="Item name *"
                value={item.item_name ?? ''}
                onChange={e => update(item._key!, 'item_name', e.target.value)}
                style={inputStyle}
                onFocus={e => { e.currentTarget.style.borderColor = '#E8650A' }}
                onBlur={e => { e.currentTarget.style.borderColor = '#383838' }}
              />
              <input
                placeholder="Description"
                value={item.item_description ?? ''}
                onChange={e => update(item._key!, 'item_description', e.target.value)}
                style={inputStyle}
                onFocus={e => { e.currentTarget.style.borderColor = '#E8650A' }}
                onBlur={e => { e.currentTarget.style.borderColor = '#383838' }}
              />
              <input
                placeholder="Quantity (e.g. 2x)"
                value={item.quantity ?? ''}
                onChange={e => update(item._key!, 'quantity', e.target.value)}
                style={inputStyle}
                onFocus={e => { e.currentTarget.style.borderColor = '#E8650A' }}
                onBlur={e => { e.currentTarget.style.borderColor = '#383838' }}
              />
            </div>

            <ImageUpload
              value={item.image_url ?? null}
              onChange={url => update(item._key!, 'image_url', url)}
              bucket="product-images"
              label="Item Photo"
              width={140}
              aspectRatio="1/1"
            />
          </div>
        ))}
      </div>

      <button
        type="button"
        onClick={add}
        style={{
          border: '1px dashed #383838', color: '#8A8A8A', background: 'transparent',
          width: '100%', padding: '10px', display: 'flex', alignItems: 'center',
          justifyContent: 'center', gap: '8px', fontSize: '13px', cursor: 'pointer',
        }}
        onMouseEnter={e => { e.currentTarget.style.borderColor = '#E8650A'; e.currentTarget.style.color = '#E8650A' }}
        onMouseLeave={e => { e.currentTarget.style.borderColor = '#383838'; e.currentTarget.style.color = '#8A8A8A' }}>
        <PlusCircle size={14} />
        Add Item
      </button>
    </div>
  )
}
