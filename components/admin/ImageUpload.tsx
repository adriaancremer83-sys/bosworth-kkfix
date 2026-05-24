'use client'

import { useState } from 'react'
import { Upload, Loader2, RefreshCw, X } from 'lucide-react'

type Bucket = 'product-images' | 'kit-images' | 'step-images'

interface ImageUploadProps {
  value: string | null
  onChange: (url: string | null) => void
  bucket: Bucket
  label?: string
  width?: number
  aspectRatio?: string
}

export default function ImageUpload({
  value,
  onChange,
  bucket,
  label,
  width = 200,
  aspectRatio = '4/3',
}: ImageUploadProps) {
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [progress, setProgress] = useState(0)

  async function handleFile(file: File) {
    if (file.size > 2 * 1024 * 1024) {
      setError('Max 2MB')
      return
    }
    setUploading(true)
    setError(null)
    setProgress(10)
    try {
      const formData = new FormData()
      formData.append('file', file)
      setProgress(40)
      const res = await fetch(`/api/upload?bucket=${bucket}`, { method: 'POST', body: formData })
      setProgress(80)
      const json = await res.json()
      if (!res.ok) throw new Error(json.error ?? 'Upload failed')
      onChange(json.url)
      setProgress(100)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Upload failed')
    } finally {
      setUploading(false)
      setTimeout(() => setProgress(0), 600)
    }
  }

  const containerStyle: React.CSSProperties = {
    width: `${width}px`,
    maxWidth: '100%',
    position: 'relative',
  }

  const boxStyle: React.CSSProperties = {
    width: '100%',
    aspectRatio,
    border: '1px dashed #383838',
    background: '#0a0a0a',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '6px',
    cursor: uploading ? 'not-allowed' : 'pointer',
    color: '#555',
    transition: 'border-color 150ms, color 150ms',
    position: 'relative',
    overflow: 'hidden',
  }

  return (
    <div style={containerStyle}>
      {label && (
        <p style={{ fontSize: '11px', color: '#8A8A8A', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '6px' }}>
          {label}
        </p>
      )}
      {error && (
        <p style={{ fontSize: '11px', color: '#CC1F28', marginBottom: '4px' }}>{error}</p>
      )}

      {value ? (
        <div style={{ position: 'relative', width: '100%', aspectRatio }}>
          <img
            src={value}
            alt=""
            style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block', border: '1px solid #2a2a2a' }}
          />
          {/* overlay buttons */}
          <div style={{
            position: 'absolute', inset: 0,
            background: 'rgba(0,0,0,0)',
            display: 'flex', alignItems: 'flex-start', justifyContent: 'flex-end',
            padding: '6px', gap: '4px',
            opacity: 0, transition: 'opacity 150ms',
          }}
          onMouseEnter={e => { e.currentTarget.style.opacity = '1'; e.currentTarget.style.background = 'rgba(0,0,0,0.4)' }}
          onMouseLeave={e => { e.currentTarget.style.opacity = '0'; e.currentTarget.style.background = 'rgba(0,0,0,0)' }}>
            <label style={{
              background: 'rgba(30,30,30,0.9)', border: '1px solid #555',
              color: '#f0f0f0', padding: '4px 8px', fontSize: '11px',
              cursor: uploading ? 'not-allowed' : 'pointer',
              display: 'flex', alignItems: 'center', gap: '4px',
            }}>
              {uploading ? <Loader2 size={11} className="animate-spin" /> : <RefreshCw size={11} />}
              {uploading ? 'Uploading…' : 'Replace'}
              <input type="file" accept="image/*" className="hidden" disabled={uploading}
                onChange={e => { const f = e.target.files?.[0]; if (f) handleFile(f); e.target.value = '' }} />
            </label>
            <button type="button" onClick={() => onChange(null)}
              style={{ background: 'rgba(232,101,10,0.85)', border: 'none', color: '#fff', padding: '4px 8px', cursor: 'pointer', display: 'flex', alignItems: 'center' }}>
              <X size={11} />
            </button>
          </div>
          {/* progress bar */}
          {uploading && (
            <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: '3px', background: '#1a1a1a' }}>
              <div style={{ height: '100%', background: '#CC1F28', width: `${progress}%`, transition: 'width 200ms' }} />
            </div>
          )}
        </div>
      ) : (
        <label
          style={boxStyle}
          onMouseEnter={e => { if (!uploading) { e.currentTarget.style.borderColor = '#CC1F28'; e.currentTarget.style.color = '#CC1F28' } }}
          onMouseLeave={e => { e.currentTarget.style.borderColor = '#383838'; e.currentTarget.style.color = '#555' }}>
          {uploading
            ? <><Loader2 size={20} className="animate-spin" /><span style={{ fontSize: '11px' }}>Uploading…</span></>
            : <><Upload size={18} /><span style={{ fontSize: '11px', textAlign: 'center' }}>Click to upload<br /><span style={{ fontSize: '10px', color: '#444' }}>Max 2MB</span></span></>}
          <input type="file" accept="image/*" className="hidden" disabled={uploading}
            onChange={e => { const f = e.target.files?.[0]; if (f) handleFile(f); e.target.value = '' }} />
          {/* progress bar */}
          {uploading && (
            <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: '3px', background: '#1a1a1a' }}>
              <div style={{ height: '100%', background: '#CC1F28', width: `${progress}%`, transition: 'width 200ms' }} />
            </div>
          )}
        </label>
      )}
    </div>
  )
}
