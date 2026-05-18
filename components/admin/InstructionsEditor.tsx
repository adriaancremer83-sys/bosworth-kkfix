'use client'

import { useState } from 'react'
import { X, PlusCircle, ChevronUp, ChevronDown, ImageIcon, Loader2, RefreshCw } from 'lucide-react'
import type { Instruction } from '@/lib/types'

type EditableInstruction = Partial<Instruction> & { _key: string }

interface InstructionsEditorProps {
  items: EditableInstruction[]
  onChange: (items: EditableInstruction[]) => void
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

const textareaStyle = { ...inputStyle, resize: 'vertical' as const, lineHeight: '1.6' }

export default function InstructionsEditor({ items, onChange }: InstructionsEditorProps) {
  const [uploadingKey, setUploadingKey] = useState<string | null>(null)
  const [uploadError, setUploadError] = useState<string | null>(null)

  function add() {
    onChange([...items, { _key: crypto.randomUUID(), step_number: items.length + 1, title: '', description: '', warning: null, image_url: null }])
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

  async function uploadImage(key: string, file: File) {
    setUploadingKey(key)
    setUploadError(null)
    try {
      const formData = new FormData()
      formData.append('file', file)
      const res = await fetch('/api/upload', { method: 'POST', body: formData })
      const json = await res.json()
      if (!res.ok) throw new Error(json.error ?? 'Upload failed')
      update(key, 'image_url', json.url)
    } catch (err) {
      setUploadError(err instanceof Error ? err.message : 'Upload failed')
    } finally {
      setUploadingKey(null)
    }
  }

  return (
    <div>
      {uploadError && (
        <div className="mb-4 px-4 py-3 rounded flex items-center justify-between gap-3"
          style={{ background: 'rgba(200,16,46,0.1)', border: '1px solid rgba(200,16,46,0.3)' }}>
          <p className="text-sm" style={{ color: '#C8102E' }}>{uploadError}</p>
          <button type="button" onClick={() => setUploadError(null)} style={{ color: '#C8102E' }}>
            <X size={14} />
          </button>
        </div>
      )}

      <div className="flex flex-col gap-4 mb-4">
        {items.length === 0 && (
          <p className="text-sm py-4 text-center" style={{ color: '#8A8A8A' }}>No steps yet. Add the first instruction step below.</p>
        )}
        {items.map((item, i) => (
          <div key={item._key} className="p-4 rounded-lg" style={{ background: '#0A0A0A', border: '1px solid #383838' }}>
            <div className="flex items-center justify-between mb-3">
              <span className="font-display text-2xl" style={{ color: '#C8102E' }}>STEP {String(i + 1).padStart(2, '0')}</span>
              <div className="flex items-center gap-1">
                <button type="button" onClick={() => moveUp(i)} className="p-1 rounded" style={{ color: '#8A8A8A' }}>
                  <ChevronUp size={14} />
                </button>
                <button type="button" onClick={() => moveDown(i)} className="p-1 rounded" style={{ color: '#8A8A8A' }}>
                  <ChevronDown size={14} />
                </button>
                <button type="button" onClick={() => remove(item._key!)} className="p-1 rounded ml-1" style={{ color: '#C8102E' }}>
                  <X size={14} />
                </button>
              </div>
            </div>

            <div className="flex flex-col gap-3">
              <input
                placeholder="Step title *"
                value={item.title ?? ''}
                onChange={e => update(item._key!, 'title', e.target.value)}
                style={inputStyle}
                onFocus={e => { e.currentTarget.style.borderColor = '#C8102E' }}
                onBlur={e => { e.currentTarget.style.borderColor = '#383838' }}
              />
              <textarea
                placeholder="Description *"
                rows={3}
                value={item.description ?? ''}
                onChange={e => update(item._key!, 'description', e.target.value)}
                style={textareaStyle}
                onFocus={e => { e.currentTarget.style.borderColor = '#C8102E' }}
                onBlur={e => { e.currentTarget.style.borderColor = '#383838' }}
              />
              <textarea
                placeholder="Warning (optional) — e.g. Wear gloves during this step"
                rows={2}
                value={item.warning ?? ''}
                onChange={e => update(item._key!, 'warning', e.target.value || null)}
                style={{
                  ...textareaStyle,
                  borderColor: item.warning ? 'rgba(217,119,6,0.5)' : '#383838',
                  background: item.warning ? 'rgba(217,119,6,0.05)' : '#0A0A0A',
                }}
                onFocus={e => { e.currentTarget.style.borderColor = '#D97706' }}
                onBlur={e => { e.currentTarget.style.borderColor = item.warning ? 'rgba(217,119,6,0.5)' : '#383838' }}
              />

              {/* Photo section */}
              <div>
                <p className="text-xs mb-2 uppercase tracking-wide" style={{ color: '#8A8A8A' }}>Step Photo</p>

                {item.image_url ? (
                  <div className="flex items-start gap-3">
                    <img
                      src={item.image_url}
                      alt="Step photo"
                      style={{ height: '100px', width: 'auto', maxWidth: '180px', objectFit: 'cover', borderRadius: '6px', border: '1px solid #383838', display: 'block' }}
                    />
                    <div className="flex flex-col gap-2">
                      <label
                        className="inline-flex items-center gap-2 px-3 py-1.5 rounded text-xs"
                        style={{ border: '1px solid #383838', color: '#8A8A8A', cursor: uploadingKey ? 'not-allowed' : 'pointer', background: '#1C1C1C' }}
                        onMouseEnter={e => { if (!uploadingKey) e.currentTarget.style.color = '#F5F5F0' }}
                        onMouseLeave={e => { e.currentTarget.style.color = '#8A8A8A' }}>
                        {uploadingKey === item._key
                          ? <><Loader2 size={12} className="animate-spin" />Uploading…</>
                          : <><RefreshCw size={12} />Replace</>}
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          disabled={uploadingKey !== null}
                          onChange={e => { const f = e.target.files?.[0]; if (f) uploadImage(item._key!, f); e.target.value = '' }}
                        />
                      </label>
                      <button
                        type="button"
                        onClick={() => update(item._key!, 'image_url', null)}
                        className="inline-flex items-center gap-2 px-3 py-1.5 rounded text-xs"
                        style={{ border: '1px solid rgba(200,16,46,0.3)', color: '#C8102E', background: 'transparent', cursor: 'pointer' }}
                        onMouseEnter={e => { e.currentTarget.style.background = 'rgba(200,16,46,0.1)' }}
                        onMouseLeave={e => { e.currentTarget.style.background = 'transparent' }}>
                        <X size={12} />
                        Remove
                      </button>
                    </div>
                  </div>
                ) : (
                  <label
                    className="inline-flex items-center gap-2 px-4 py-2.5 rounded text-xs"
                    style={{
                      border: '1px dashed #383838',
                      color: '#8A8A8A',
                      cursor: uploadingKey ? 'not-allowed' : 'pointer',
                      background: 'transparent',
                    }}
                    onMouseEnter={e => { if (!uploadingKey) { e.currentTarget.style.borderColor = '#C8102E'; e.currentTarget.style.color = '#C8102E' } }}
                    onMouseLeave={e => { if (!uploadingKey) { e.currentTarget.style.borderColor = '#383838'; e.currentTarget.style.color = '#8A8A8A' } }}>
                    {uploadingKey === item._key
                      ? <><Loader2 size={13} className="animate-spin" />Uploading…</>
                      : <><ImageIcon size={13} />Add Photo</>}
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      disabled={uploadingKey !== null}
                      onChange={e => { const f = e.target.files?.[0]; if (f) uploadImage(item._key!, f); e.target.value = '' }}
                    />
                  </label>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      <button
        type="button"
        onClick={add}
        className="flex items-center gap-2 px-4 py-2 rounded text-sm"
        style={{ border: '1px dashed #383838', color: '#8A8A8A', background: 'transparent', width: '100%', justifyContent: 'center' }}
        onMouseEnter={e => { e.currentTarget.style.borderColor = '#C8102E'; e.currentTarget.style.color = '#C8102E' }}
        onMouseLeave={e => { e.currentTarget.style.borderColor = '#383838'; e.currentTarget.style.color = '#8A8A8A' }}>
        <PlusCircle size={14} />
        Add Step
      </button>
    </div>
  )
}
