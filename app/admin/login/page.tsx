'use client'

import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Loader2, Eye, EyeOff, Lock } from 'lucide-react'
import { Suspense } from 'react'
import Image from 'next/image'

function LoginForm() {
  const router       = useRouter()
  const searchParams = useSearchParams()
  const from         = searchParams.get('from') ?? '/admin/products'

  const [password,  setPassword]  = useState('')
  const [show,      setShow]      = useState(false)
  const [loading,   setLoading]   = useState(false)
  const [error,     setError]     = useState<string | null>(null)
  const [shake,     setShake]     = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!password.trim()) return

    setLoading(true)
    setError(null)

    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      })
      const data = await res.json()

      if (!res.ok) {
        setError(data.error ?? 'Invalid password')
        setShake(true)
        setTimeout(() => setShake(false), 500)
        setPassword('')
        return
      }

      router.push(from)
      router.refresh()
    } catch {
      setError('Connection error — try again')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div
      className="min-h-screen flex items-center justify-center px-4"
      style={{ background: '#0a0a0a' }}>

      {/* Background glow */}
      <div style={{
        position: 'fixed', top: '30%', left: '50%', transform: 'translateX(-50%)',
        width: '600px', height: '300px',
        background: 'radial-gradient(ellipse, rgba(232,101,10,0.06) 0%, transparent 70%)',
        pointerEvents: 'none',
      }} />

      <div style={{
        width: '100%', maxWidth: '380px',
        background: '#0f0f0f',
        border: '1px solid #1e1e1e',
        padding: '40px 36px',
        position: 'relative',
        animation: shake ? 'shake 0.4s ease' : 'none',
      }}>
        {/* Orange top rule */}
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '3px', background: '#E8650A' }} />

        {/* Logo + brand */}
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <div style={{ position: 'relative', height: '32px', width: '140px', margin: '0 auto 12px' }}>
            <Image
              src="/images/bosworth-logo-new.png"
              alt="Bosworth"
              fill
              style={{ objectFit: 'contain', objectPosition: 'center' }}
              priority
            />
          </div>
          <p className="font-display" style={{ fontSize: '13px', color: '#E8650A', letterSpacing: '4px', textTransform: 'uppercase' }}>
            KK-FIX Admin
          </p>
          <div style={{ width: '40px', height: '2px', background: '#1e1e1e', margin: '12px auto 0' }} />
        </div>

        <form onSubmit={handleSubmit}>
          {/* Error */}
          {error && (
            <div style={{
              background: 'rgba(232,101,10,0.08)',
              border: '1px solid rgba(232,101,10,0.25)',
              padding: '10px 14px',
              marginBottom: '18px',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
            }}>
              <Lock size={13} style={{ color: '#E8650A', flexShrink: 0 }} />
              <p style={{ fontSize: '13px', color: '#E8650A' }}>{error}</p>
            </div>
          )}

          <div style={{ marginBottom: '20px' }}>
            <label style={{
              display: 'block', fontSize: '11px', fontWeight: 600,
              color: '#555', textTransform: 'uppercase', letterSpacing: '1.5px', marginBottom: '8px',
            }}>
              Password
            </label>
            <div style={{ position: 'relative' }}>
              <input
                type={show ? 'text' : 'password'}
                value={password}
                onChange={e => { setPassword(e.target.value); setError(null) }}
                placeholder="Enter admin password"
                autoComplete="current-password"
                autoFocus
                style={{
                  width: '100%', background: '#0a0a0a',
                  border: `1px solid ${error ? 'rgba(232,101,10,0.4)' : '#2a2a2a'}`,
                  color: '#f0f0f0', padding: '12px 44px 12px 14px',
                  fontSize: '14px', outline: 'none',
                  fontFamily: 'Inter, sans-serif',
                  boxSizing: 'border-box',
                  transition: 'border-color 150ms',
                }}
                onFocus={e => { e.currentTarget.style.borderColor = '#E8650A' }}
                onBlur={e => { e.currentTarget.style.borderColor = error ? 'rgba(232,101,10,0.4)' : '#2a2a2a' }}
              />
              <button
                type="button"
                onClick={() => setShow(s => !s)}
                style={{
                  position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)',
                  background: 'none', border: 'none', color: '#555', cursor: 'pointer', padding: '2px',
                  display: 'flex', alignItems: 'center',
                }}>
                {show ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading || !password.trim()}
            style={{
              width: '100%', background: loading || !password.trim() ? '#1a1a1a' : '#E8650A',
              color: loading || !password.trim() ? '#444' : '#fff',
              border: 'none', padding: '13px',
              fontSize: '13px', fontWeight: 600, letterSpacing: '1.5px',
              textTransform: 'uppercase', cursor: loading || !password.trim() ? 'not-allowed' : 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
              transition: 'background 150ms, color 150ms',
              fontFamily: 'Inter, sans-serif',
            }}
            onMouseEnter={e => { if (!loading && password.trim()) e.currentTarget.style.background = '#C4530A' }}
            onMouseLeave={e => { if (!loading && password.trim()) e.currentTarget.style.background = '#E8650A' }}>
            {loading ? <><Loader2 size={14} className="animate-spin" /> Signing in…</> : 'Sign In'}
          </button>
        </form>

        <p style={{ textAlign: 'center', fontSize: '11px', color: '#2a2a2a', marginTop: '24px' }}>
          KK-Fix Product Portal — Bosworth
        </p>
      </div>

      {/* Shake keyframe */}
      <style>{`
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          20%       { transform: translateX(-8px); }
          40%       { transform: translateX(8px); }
          60%       { transform: translateX(-6px); }
          80%       { transform: translateX(6px); }
        }
      `}</style>
    </div>
  )
}

export default function LoginPage() {
  return (
    <Suspense fallback={null}>
      <LoginForm />
    </Suspense>
  )
}
