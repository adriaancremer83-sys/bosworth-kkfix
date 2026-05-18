'use client'

import { GripVertical, X, PlusCircle, ChevronUp, ChevronDown } from 'lucide-react'
import type { KitContent } from '@/lib/types'

type EditableKitContent = Partial<KitContent> & { _key: string }

interface KitContentsEditorProps {
  items: EditableKitContent[]
  onChange: (items: EditableKitContent[]) => void
}

const inputStyle = {
  background: '#0A0A0A',
  border: '1px solid #383838',
  color: '#F5F5F0',
  borderRadius: '6px',
  padding: '8px 12px',
  fontSize: '13px',
  outline: 'none',
  width: '100%',
  fontFamily: 'DM Sans, sans-serif',
}

export default function KitContentsEditor({ items, onChange }: KitContentsEditorProps) {
  function add() {
    onChange([...items, { _key: crypto.randomUUID(), item_name: '', item_description: '', quantity: '', sort_order: items.length }])
  }

  function update(key: string, field: keyof EditableKitContent, value: string) {
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
          <div key={item._key} className="p-3 rounded-lg" style={{ background: '#0A0A0A', border: '1px solid #383838' }}>
            <div className="flex items-center gap-2 mb-2">
              <GripVertical size={16} className="flex-shrink-0" style={{ color: '#383838' }} />
              <span className="font-display text-lg flex-shrink-0 w-6 text-center" style={{ color: '#C8102E' }}>
                {String(i + 1).padStart(2, '0')}
              </span>
              <div className="flex items-center gap-1 ml-auto">
                <button type="button" onClick={() => moveUp(i)} className="p-1 rounded" style={{ color: '#8A8A8A' }}>
                  <ChevronUp size={14} />
                </button>
                <button type="button" onClick={() => moveDown(i)} className="p-1 rounded" style={{ color: '#8A8A8A' }}>
                  <ChevronDown size={14} />
                </button>
                <button type="button" onClick={() => remove(item._key!)} className="p-1 rounded" style={{ color: '#C8102E' }}>
                  <X size={14} />
                </button>
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              <input
                placeholder="Item name *"
                value={item.item_name ?? ''}
                onChange={e => update(item._key!, 'item_name', e.target.value)}
                style={inputStyle}
                onFocus={e => { e.currentTarget.style.borderColor = '#C8102E' }}
                onBlur={e => { e.currentTarget.style.borderColor = '#383838' }}
              />
              <input
                placeholder="Description"
                value={item.item_description ?? ''}
                onChange={e => update(item._key!, 'item_description', e.target.value)}
                style={inputStyle}
                onFocus={e => { e.currentTarget.style.borderColor = '#C8102E' }}
                onBlur={e => { e.currentTarget.style.borderColor = '#383838' }}
              />
              <input
                placeholder="Quantity"
                value={item.quantity ?? ''}
                onChange={e => update(item._key!, 'quantity', e.target.value)}
                style={inputStyle}
                onFocus={e => { e.currentTarget.style.borderColor = '#C8102E' }}
                onBlur={e => { e.currentTarget.style.borderColor = '#383838' }}
              />
            </div>
          </div>
        ))}
      </div>
      <button
        type="button"
        onClick={add}
        className="flex items-center gap-2 px-4 py-2 rounded text-sm transition-colors"
        style={{ border: '1px dashed #383838', color: '#8A8A8A', background: 'transparent', width: '100%', justifyContent: 'center' }}
        onMouseEnter={e => { e.currentTarget.style.borderColor = '#C8102E'; e.currentTarget.style.color = '#C8102E' }}
        onMouseLeave={e => { e.currentTarget.style.borderColor = '#383838'; e.currentTarget.style.color = '#8A8A8A' }}>
        <PlusCircle size={14} />
        Add Item
      </button>
    </div>
  )
}
