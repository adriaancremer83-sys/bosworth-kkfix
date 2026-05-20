'use client'

import { Download } from 'lucide-react'
import Image from 'next/image'

interface NavbarProps {
  productName: string
  msdsUrl: string | null
}

export default function Navbar({ productName, msdsUrl }: NavbarProps) {
  return (
    <nav
      className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 md:px-10"
      style={{
        background: 'rgba(10,10,10,0.95)',
        backdropFilter: 'blur(12px)',
        borderBottom: '2px solid #E8650A',
        height: '64px',
      }}>
      <div className="flex items-center gap-4">
        <div style={{ position: 'relative', height: '28px', width: '120px', flexShrink: 0 }}>
          <Image
            src="/images/bosworth-logo-new.png"
            alt="Bosworth"
            fill
            style={{ objectFit: 'contain', objectPosition: 'left center' }}
            priority
          />
        </div>
        <div style={{ width: '1px', height: '20px', background: '#2a2a2a' }} />
        <span
          className="font-display"
          style={{ fontSize: '15px', letterSpacing: '2px', color: '#E8650A', textTransform: 'uppercase' }}>
          KK-FIX
        </span>
        <div style={{ width: '1px', height: '20px', background: '#2a2a2a' }} />
        <span style={{ fontSize: '13px', fontWeight: 400, color: '#8a9ab0' }}>
          {productName}
        </span>
      </div>

      {msdsUrl && (
        <a
          href={msdsUrl}
          target="_blank"
          rel="noopener noreferrer"
          style={{
            border: '1px solid #E8650A',
            color: '#E8650A',
            padding: '7px 16px',
            fontSize: '12px',
            fontWeight: 500,
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            textDecoration: 'none',
            background: 'transparent',
            letterSpacing: '0.5px',
            transition: 'background 150ms, color 150ms',
          }}
          onMouseEnter={e => {
            e.currentTarget.style.background = '#E8650A'
            e.currentTarget.style.color = '#fff'
          }}
          onMouseLeave={e => {
            e.currentTarget.style.background = 'transparent'
            e.currentTarget.style.color = '#E8650A'
          }}>
          <Download size={12} />
          SDS
        </a>
      )}
    </nav>
  )
}
