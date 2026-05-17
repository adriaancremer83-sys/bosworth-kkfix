'use client'

import { useRouter } from 'next/navigation'

export default function LoginPage() {
  const router = useRouter()

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    router.push('/admin/products')
  }

  return (
    <div
      className="min-h-screen flex items-center justify-center px-4"
      style={{ background: '#0A0A0A' }}>
      <div
        className="w-full max-w-sm p-8 rounded-lg"
        style={{ background: '#ffffff' }}>

        <div className="text-center mb-6">
          <p
            className="font-display text-5xl tracking-widest"
            style={{ color: '#C8102E' }}>
            BOSWORTH
          </p>
          <p className="text-sm mt-1" style={{ color: '#6b7280', fontFamily: 'DM Sans, sans-serif' }}>
            Admin Portal
          </p>
          <div className="mt-4 h-0.5 mx-auto w-16" style={{ background: '#C8102E' }} />
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label
              className="block text-xs mb-1.5 tracking-wide uppercase font-medium"
              style={{ color: '#374151' }}>
              Email
            </label>
            <input
              type="email"
              placeholder="admin@bosworth.co.za"
              style={{
                background: '#f9fafb',
                border: '1px solid #d1d5db',
                color: '#111827',
                borderRadius: '6px',
                padding: '11px 14px',
                width: '100%',
                outline: 'none',
                fontFamily: 'DM Sans, sans-serif',
                fontSize: '14px',
              }}
              onFocus={e => { e.currentTarget.style.borderColor = '#C8102E' }}
              onBlur={e => { e.currentTarget.style.borderColor = '#d1d5db' }}
            />
          </div>

          <div>
            <label
              className="block text-xs mb-1.5 tracking-wide uppercase font-medium"
              style={{ color: '#374151' }}>
              Password
            </label>
            <input
              type="password"
              placeholder="••••••••"
              style={{
                background: '#f9fafb',
                border: '1px solid #d1d5db',
                color: '#111827',
                borderRadius: '6px',
                padding: '11px 14px',
                width: '100%',
                outline: 'none',
                fontFamily: 'DM Sans, sans-serif',
                fontSize: '14px',
              }}
              onFocus={e => { e.currentTarget.style.borderColor = '#C8102E' }}
              onBlur={e => { e.currentTarget.style.borderColor = '#d1d5db' }}
            />
          </div>

          <button
            type="submit"
            className="flex items-center justify-center w-full py-3 rounded font-medium text-sm tracking-wide mt-1"
            style={{
              background: '#C8102E',
              color: '#ffffff',
              border: 'none',
              cursor: 'pointer',
            }}>
            Sign In
          </button>
        </form>
      </div>
    </div>
  )
}
