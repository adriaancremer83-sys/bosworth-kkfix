'use client'

import { X, PlusCircle } from 'lucide-react'

export interface EditableTechSpec {
  _key: string
  key: string
  value: string
}

interface TechSpecsEditorProps {
  items: EditableTechSpec[]
  onChange: (items: EditableTechSpec[]) => void
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

export default function TechSpecsEditor({ items, onChange }: TechSpecsEditorProps) {
  function add() {
    onChange([...items, { _key: crypto.randomUUID(), key: '', value: '' }])
  }

  function update(_key: string, field: 'key' | 'value', val: string) {
    onChange(items.map(item => item._key === _key ? { ...item, [field]: val } : item))
  }

  function remove(_key: string) {
    onChange(items.filter(item => item._key !== _key))
  }

  return (
    <div>
      <div style={{ overflowX: 'auto', marginBottom: '12px' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid #1e1e1e' }}>
              <th style={{ textAlign: 'left', padding: '8px 12px', fontSize: '10px', color: '#555', textTransform: 'uppercase', letterSpacing: '1.5px', width: '45%' }}>
                Specification
              </th>
              <th style={{ textAlign: 'left', padding: '8px 12px', fontSize: '10px', color: '#555', textTransform: 'uppercase', letterSpacing: '1.5px' }}>
                Value
              </th>
              <th style={{ width: '40px' }} />
            </tr>
          </thead>
          <tbody>
            {items.length === 0 && (
              <tr>
                <td colSpan={3} style={{ textAlign: 'center', padding: '28px', color: '#555', fontSize: '13px' }}>
                  No specs yet — add rows below.
                </td>
              </tr>
            )}
            {items.map((item, i) => (
              <tr key={item._key} style={{ borderBottom: '1px solid #111' }}>
                <td style={{ padding: '6px 6px 6px 0' }}>
                  <input
                    placeholder={`e.g. Working Temperature`}
                    value={item.key}
                    onChange={e => update(item._key, 'key', e.target.value)}
                    style={inputStyle}
                    onFocus={e => { e.currentTarget.style.borderColor = '#CC1F28' }}
                    onBlur={e => { e.currentTarget.style.borderColor = '#383838' }}
                  />
                </td>
                <td style={{ padding: '6px' }}>
                  <input
                    placeholder="e.g. -20°C to +80°C"
                    value={item.value}
                    onChange={e => update(item._key, 'value', e.target.value)}
                    style={inputStyle}
                    onFocus={e => { e.currentTarget.style.borderColor = '#CC1F28' }}
                    onBlur={e => { e.currentTarget.style.borderColor = '#383838' }}
                  />
                </td>
                <td style={{ padding: '6px', textAlign: 'center' }}>
                  <button type="button" onClick={() => remove(item._key)}
                    style={{ color: '#CC1F28', background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center' }}>
                    <X size={14} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <button
        type="button"
        onClick={add}
        style={{
          border: '1px dashed #383838', color: '#8A8A8A', background: 'transparent',
          width: '100%', padding: '10px', display: 'flex', alignItems: 'center',
          justifyContent: 'center', gap: '8px', fontSize: '13px', cursor: 'pointer',
        }}
        onMouseEnter={e => { e.currentTarget.style.borderColor = '#CC1F28'; e.currentTarget.style.color = '#CC1F28' }}
        onMouseLeave={e => { e.currentTarget.style.borderColor = '#383838'; e.currentTarget.style.color = '#8A8A8A' }}>
        <PlusCircle size={14} />
        Add Row
      </button>
    </div>
  )
}
