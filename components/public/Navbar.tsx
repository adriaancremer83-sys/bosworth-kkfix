'use client'

import { Download } from 'lucide-react'

interface NavbarProps {
  productName: string
  msdsUrl: string | null
}

export default function Navbar({ productName, msdsUrl }: NavbarProps) {
  return (
    <nav
      className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-10"
      style={{
        background: '#FFFFFF',
        borderBottom: '3px solid #C8102E',
        height: '70px',
      }}>
      <div className="flex items-center gap-4">
        <span
          className="font-display tracking-widest"
          style={{ fontSize: '28px', color: '#C8102E', lineHeight: 1 }}>
          BOSWORTH
        </span>
        <div style={{ width: '1px', height: '20px', background: '#E0E0E0' }} />
        <span style={{ fontSize: '16px', fontWeight: 500, color: '#111111' }}>
          {productName}
        </span>
      </div>

      {msdsUrl && (
        <a
          href={msdsUrl}
          target="_blank"
          rel="noopener noreferrer"
          style={{
            border: '1px solid #C8102E',
            color: '#C8102E',
            padding: '8px 16px',
            borderRadius: '4px',
            fontSize: '13px',
            fontWeight: 500,
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            textDecoration: 'none',
            background: 'transparent',
          }}>
          <Download size={13} />
          Download SDS
        </a>
      )}
    </nav>
  )
}
