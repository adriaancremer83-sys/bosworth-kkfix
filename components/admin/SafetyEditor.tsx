'use client'

import { X, PlusCircle } from 'lucide-react'
import type { SafetyItem } from '@/lib/types'

type EditableSafetyItem = Partial<SafetyItem> & { _key: string }

interface SafetyEditorProps {
  items: EditableSafetyItem[]
  onChange: (items: EditableSafetyItem[]) => void
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

const typeColors: Record<string, { color: string; label: string }> = {
  hazard: { color: '#E8650A', label: 'Hazard' },
  ppe: { color: '#60a5fa', label: 'PPE' },
  warning: { color: '#D97706', label: 'Warning' },
  disposal: { color: '#16A34A', label: 'Disposal' },
}

export default function SafetyEditor({ items, onChange }: SafetyEditorProps) {
  function add() {
    onChange([...items, { _key: crypto.randomUUID(), type: 'warning', icon: 'alert-triangle', label: '', description: '', sort_order: items.length }])
  }

  function update(key: string, field: keyof EditableSafetyItem, value: string) {
    onChange(items.map(item => item._key === key ? { ...item, [field]: value } : item))
  }

  function remove(key: string) {
    onChange(items.filter(item => item._key !== key))
  }

  return (
    <div>
      <div className="flex flex-col gap-3 mb-4">
        {items.length === 0 && (
          <p className="text-sm py-4 text-center" style={{ color: '#8A8A8A' }}>No safety items yet. Add items below.</p>
        )}
        {items.map(item => {
          const typeColor = typeColors[item.type ?? 'warning']?.color ?? '#8A8A8A'
          return (
            <div key={item._key} className="p-3 rounded-lg" style={{ background: '#0A0A0A', border: `1px solid ${typeColor}33` }}>
              <div className="flex justify-end mb-2">
                <button type="button" onClick={() => remove(item._key!)} className="p-1 rounded" style={{ color: '#E8650A' }}>
                  <X size={14} />
                </button>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                <select
                  value={item.type ?? 'warning'}
                  onChange={e => update(item._key!, 'type', e.target.value)}
                  style={{ ...inputStyle, color: typeColor }}>
                  <option value="hazard">Hazard</option>
                  <option value="ppe">PPE</option>
                  <option value="warning">Warning</option>
                  <option value="disposal">Disposal</option>
                </select>
                <input
                  placeholder="Icon (e.g. flame)"
                  value={item.icon ?? ''}
                  onChange={e => update(item._key!, 'icon', e.target.value)}
                  style={inputStyle}
                  onFocus={e => { e.currentTarget.style.borderColor = '#E8650A' }}
                  onBlur={e => { e.currentTarget.style.borderColor = '#383838' }}
                />
                <input
                  placeholder="Label *"
                  value={item.label ?? ''}
                  onChange={e => update(item._key!, 'label', e.target.value)}
                  style={inputStyle}
                  onFocus={e => { e.currentTarget.style.borderColor = '#E8650A' }}
                  onBlur={e => { e.currentTarget.style.borderColor = '#383838' }}
                />
                <input
                  placeholder="Description"
                  value={item.description ?? ''}
                  onChange={e => update(item._key!, 'description', e.target.value)}
                  style={inputStyle}
                  onFocus={e => { e.currentTarget.style.borderColor = '#E8650A' }}
                  onBlur={e => { e.currentTarget.style.borderColor = '#383838' }}
                />
              </div>
            </div>
          )
        })}
      </div>
      <button
        type="button"
        onClick={add}
        className="flex items-center gap-2 px-4 py-2 rounded text-sm"
        style={{ border: '1px dashed #383838', color: '#8A8A8A', background: 'transparent', width: '100%', justifyContent: 'center' }}
        onMouseEnter={e => { e.currentTarget.style.borderColor = '#E8650A'; e.currentTarget.style.color = '#E8650A' }}
        onMouseLeave={e => { e.currentTarget.style.borderColor = '#383838'; e.currentTarget.style.color = '#8A8A8A' }}>
        <PlusCircle size={14} />
        Add Safety Item
      </button>
    </div>
  )
}
