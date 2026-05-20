'use client'

import { X, PlusCircle, ChevronUp, ChevronDown } from 'lucide-react'
import type { Instruction } from '@/lib/types'
import ImageUpload from './ImageUpload'

type EditableInstruction = Partial<Instruction> & { _key: string }

interface InstructionsEditorProps {
  items: EditableInstruction[]
  onChange: (items: EditableInstruction[]) => void
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

const textareaStyle: React.CSSProperties = { ...inputStyle, resize: 'vertical', lineHeight: '1.6' }

export default function InstructionsEditor({ items, onChange }: InstructionsEditorProps) {
  function add() {
    onChange([...items, {
      _key: crypto.randomUUID(),
      step_number: items.length + 1,
      title: '',
      description: '',
      warning: null,
      image_url: null,
      estimated_time: null,
    }])
  }

  function update(key: string, field: keyof EditableInstruction, value: string | null) {
    onChange(items.map(item => item._key === key ? { ...item, [field]: value } : item))
  }

  function remove(key: string) {
    onChange(items.filter(item => item._key !== key).map((item, idx) => ({ ...item, step_number: idx + 1 })))
  }

  function moveUp(index: number) {
    if (index === 0) return
    const next = [...items]
    ;[next[index - 1], next[index]] = [next[index], next[index - 1]]
    onChange(next.map((item, idx) => ({ ...item, step_number: idx + 1 })))
  }

  function moveDown(index: number) {
    if (index === items.length - 1) return
    const next = [...items]
    ;[next[index], next[index + 1]] = [next[index + 1], next[index]]
    onChange(next.map((item, idx) => ({ ...item, step_number: idx + 1 })))
  }

  return (
    <div>
      <div className="flex flex-col gap-4 mb-4">
        {items.length === 0 && (
          <p className="text-sm py-4 text-center" style={{ color: '#8A8A8A' }}>No steps yet. Add the first instruction step below.</p>
        )}
        {items.map((item, i) => (
          <div key={item._key} className="p-4 rounded-lg" style={{ background: '#0A0A0A', border: '1px solid #383838' }}>
            <div className="flex items-center justify-between mb-3">
              <span className="font-display text-2xl" style={{ color: '#E8650A' }}>STEP {String(i + 1).padStart(2, '0')}</span>
              <div className="flex items-center gap-1">
                <button type="button" onClick={() => moveUp(i)} style={{ color: '#8A8A8A', background: 'none', border: 'none', cursor: 'pointer', padding: '4px' }}>
                  <ChevronUp size={14} />
                </button>
                <button type="button" onClick={() => moveDown(i)} style={{ color: '#8A8A8A', background: 'none', border: 'none', cursor: 'pointer', padding: '4px' }}>
                  <ChevronDown size={14} />
                </button>
                <button type="button" onClick={() => remove(item._key!)} style={{ color: '#E8650A', background: 'none', border: 'none', cursor: 'pointer', padding: '4px', marginLeft: '4px' }}>
                  <X size={14} />
                </button>
              </div>
            </div>

            <div className="flex flex-col gap-3">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                <div className="sm:col-span-2">
                  <input
                    placeholder="Step title *"
                    value={item.title ?? ''}
                    onChange={e => update(item._key!, 'title', e.target.value)}
                    style={inputStyle}
                    onFocus={e => { e.currentTarget.style.borderColor = '#E8650A' }}
                    onBlur={e => { e.currentTarget.style.borderColor = '#383838' }}
                  />
                </div>
                <div>
                  <input
                    placeholder="Est. time (e.g. 5 min)"
                    value={item.estimated_time ?? ''}
                    onChange={e => update(item._key!, 'estimated_time', e.target.value || null)}
                    style={inputStyle}
                    onFocus={e => { e.currentTarget.style.borderColor = '#E8650A' }}
                    onBlur={e => { e.currentTarget.style.borderColor = '#383838' }}
                  />
                </div>
              </div>

              <textarea
                placeholder="Description *"
                rows={3}
                value={item.description ?? ''}
                onChange={e => update(item._key!, 'description', e.target.value)}
                style={textareaStyle}
                onFocus={e => { e.currentTarget.style.borderColor = '#E8650A' }}
                onBlur={e => { e.currentTarget.style.borderColor = '#383838' }}
              />

              <textarea
                placeholder="⚠ Warning (optional) — e.g. Wear gloves during this step"
                rows={2}
                value={item.warning ?? ''}
                onChange={e => update(item._key!, 'warning', e.target.value || null)}
                style={{
                  ...textareaStyle,
                  borderColor: item.warning ? 'rgba(245,158,11,0.4)' : '#383838',
                  background: item.warning ? 'rgba(245,158,11,0.04)' : '#0A0A0A',
                }}
                onFocus={e => { e.currentTarget.style.borderColor = '#f59e0b' }}
                onBlur={e => { e.currentTarget.style.borderColor = item.warning ? 'rgba(245,158,11,0.4)' : '#383838' }}
              />

              <ImageUpload
                value={item.image_url ?? null}
                onChange={url => update(item._key!, 'image_url', url)}
                bucket="step-images"
                label="Step Photo / Diagram"
                width={200}
                aspectRatio="4/3"
              />
            </div>
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
        Add Step
      </button>
    </div>
  )
}
