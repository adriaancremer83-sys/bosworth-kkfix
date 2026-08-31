'use client'

import Image from 'next/image'

export default function ProductFooter() {
  return (
    <footer style={{ background: '#0a0a0a', borderTop: '1px solid #1a1a1a', padding: 'clamp(40px, 6vw, 60px) clamp(24px, 6vw, 80px) clamp(24px, 4vw, 40px)' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '8px' }}>
          <div style={{ position: 'relative', height: '32px', width: '140px' }}>
            <Image
              src="/images/bosworth-logo-new.png"
              alt="Bosworth"
              fill
              style={{ objectFit: 'contain', objectPosition: 'left center' }}
            />
          </div>
          <div style={{ height: '1px', flex: 1, background: '#1a1a1a' }} />
          <span className="font-display" style={{ fontSize: '14px', color: '#CC1F28', letterSpacing: '3px' }}>KK-FIX</span>
        </div>

        <div style={{ height: '2px', background: '#CC1F28', margin: '20px 0 32px 0', maxWidth: '120px' }} />

        <div style={{ marginBottom: '40px' }}>
          <p style={{ fontSize: '10px', fontWeight: 700, color: '#CC1F28', textTransform: 'uppercase', letterSpacing: '3px', marginBottom: '16px' }}>
            Certifications
          </p>
          <p className="font-mono-tech" style={{ fontSize: '12px', color: '#555', lineHeight: 1.9 }}>
            ISO 9001:2015<br />
            ISO 14001:2015<br />
            ISO 45001:2018<br />
            Member: CMA of South Africa
          </p>
        </div>

        <div style={{
          borderTop: '1px solid #1a1a1a',
          paddingTop: '24px',
          display: 'flex',
          flexWrap: 'wrap',
          justifyContent: 'space-between',
          alignItems: 'center',
          gap: '12px',
        }}>
          <p style={{ fontSize: '11px', color: '#333' }}>
            © {new Date().getFullYear()} Bosworth — A Division of Hudaco Trading (Pty) Ltd.
          </p>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <p style={{ fontSize: '11px', color: '#333' }}>Part of the Hudaco Group</p>
            <span style={{ fontSize: '11px', color: '#222' }}>·</span>
            <a
              href="https://www.forgesystems.co.za"
              target="_blank"
              rel="noopener noreferrer"
              style={{ fontSize: '11px', color: '#555', textDecoration: 'none', fontWeight: 700, transition: 'color 150ms' }}
              onMouseEnter={e => { e.currentTarget.style.color = '#CC1F28' }}
              onMouseLeave={e => { e.currentTarget.style.color = '#555' }}>
              Built by Forge Systems
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}
