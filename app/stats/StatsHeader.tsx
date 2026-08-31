'use client'

import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { LogOut } from 'lucide-react'

export default function StatsHeader() {
  const router = useRouter()

  async function logout() {
    await fetch('/api/stats/logout', { method: 'POST' })
    router.push('/stats/login')
    router.refresh()
  }

  return (
    <header
      style={{
        borderBottom: '2px solid #CC1F28',
        background: 'rgba(10,10,10,0.95)',
        padding: '0 clamp(16px, 4vw, 32px)',
        height: '60px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
      }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
        <div style={{ position: 'relative', height: '24px', width: '110px' }}>
          <Image
            src="/images/bosworth-logo-new.png"
            alt="Bosworth"
            fill
            sizes="110px"
            style={{ objectFit: 'contain', objectPosition: 'left center' }}
          />
        </div>
        <span
          className="font-display"
          style={{ fontSize: '13px', letterSpacing: '2px', color: '#CC1F28', textTransform: 'uppercase' }}>
          KK-FIX Scan Stats
        </span>
      </div>
      <button
        onClick={logout}
        style={{
          display: 'flex', alignItems: 'center', gap: '6px',
          background: 'transparent', border: '1px solid #383838', color: '#8a9ab0',
          padding: '7px 14px', fontSize: '12px', cursor: 'pointer',
          fontFamily: 'Inter, sans-serif',
        }}>
        <LogOut size={13} /> Sign out
      </button>
    </header>
  )
}
