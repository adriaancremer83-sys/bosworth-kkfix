'use client'

export default function ProductFooter() {
  return (
    <footer style={{ background: '#0A0A0A', padding: 'clamp(24px, 6vw, 60px) clamp(24px, 6vw, 80px) clamp(24px, 4vw, 40px)' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        <h2 className="font-display" style={{ fontSize: '48px', color: '#FFFFFF', lineHeight: 1 }}>
          BOSWORTH
        </h2>
        <div style={{ height: '3px', background: '#C8102E', margin: '24px 0' }} />

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '40px', marginBottom: '40px' }}>
          <div>
            <p style={{ fontSize: '11px', fontWeight: 700, color: '#C8102E', textTransform: 'uppercase', letterSpacing: '3px', marginBottom: '16px' }}>
              Address
            </p>
            <p style={{ fontSize: '14px', color: '#888888', lineHeight: 1.8 }}>
              21 Vereeniging Rd<br />
              Alrode<br />
              South Africa
            </p>
          </div>

          <div>
            <p style={{ fontSize: '11px', fontWeight: 700, color: '#C8102E', textTransform: 'uppercase', letterSpacing: '3px', marginBottom: '16px' }}>
              Contact
            </p>
            <p style={{ fontSize: '14px', lineHeight: 1.8 }}>
              <a href="mailto:pulleys@bosworth.co.za" style={{ color: '#888888', textDecoration: 'none' }}>
                pulleys@bosworth.co.za
              </a>
              <br />
              <a href="tel:+27118641643" style={{ color: '#888888', textDecoration: 'none' }}>
                +27 11 864 1643
              </a>
            </p>
          </div>

          <div>
            <p style={{ fontSize: '11px', fontWeight: 700, color: '#C8102E', textTransform: 'uppercase', letterSpacing: '3px', marginBottom: '16px' }}>
              Certifications
            </p>
            <p style={{ fontSize: '14px', color: '#888888', lineHeight: 1.8 }}>
              ISO 9001:2015<br />
              ISO 14001:2015<br />
              ISO 45001:2015<br />
              Member: CMA of South Africa
            </p>
          </div>
        </div>

        <div style={{
          borderTop: '1px solid #222222',
          paddingTop: '24px',
          display: 'flex',
          flexWrap: 'wrap',
          justifyContent: 'space-between',
          alignItems: 'center',
          gap: '12px',
        }}>
          <p style={{ fontSize: '12px', color: '#555555' }}>
            © 2025 Bosworth — A Division of Hudaco Trading Ltd.
          </p>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <p style={{ fontSize: '12px', color: '#555555' }}>
              Part of the Hudaco Group
            </p>
            <span style={{ fontSize: '12px', color: '#333333' }}>·</span>
            <a
              href="/admin/products"
              style={{ fontSize: '11px', fontWeight: 400, color: '#333333', textDecoration: 'none' }}
              onMouseEnter={e => { e.currentTarget.style.color = '#C8102E' }}
              onMouseLeave={e => { e.currentTarget.style.color = '#333333' }}>
              Admin
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}
