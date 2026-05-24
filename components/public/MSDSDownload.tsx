'use client'

import { motion } from 'framer-motion'
import { Download } from 'lucide-react'

interface MSDSDownloadProps {
  msdsUrl: string | null
}

export default function MSDSDownload({ msdsUrl }: MSDSDownloadProps) {
  return (
    <section style={{ background: '#111111', borderTop: '1px solid #1e1e1e', padding: 'clamp(40px, 6vw, 60px) clamp(24px, 6vw, 80px)' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: '32px' }}>
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-50px' }}
          transition={{ duration: 0.4 }}>
          <p style={{ fontSize: '11px', color: '#CC1F28', textTransform: 'uppercase', letterSpacing: '3px', marginBottom: '8px', fontWeight: 500 }}>
            Documentation
          </p>
          <h2 className="font-display" style={{ fontSize: 'clamp(28px, 4vw, 40px)', color: '#f0f0f0', lineHeight: 1 }}>
            Safety Data Sheet
          </h2>
          <p style={{ fontSize: '13px', color: '#555', marginTop: '8px' }}>
            Version 2 — Mercury Free — November 2025
          </p>
          <p style={{ fontSize: '12px', color: '#444', marginTop: '4px' }}>
            Prepared by A. Pieterse | Approved by L. van der Vyver
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 8 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-50px' }}
          transition={{ duration: 0.4, delay: 0.1 }}
          style={{ flexShrink: 0 }}>
          {msdsUrl ? (
            <a
              href={msdsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="font-display"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                background: '#CC1F28',
                color: '#fff',
                fontSize: '17px',
                letterSpacing: '2px',
                padding: '16px 40px',
                textDecoration: 'none',
                transition: 'background 150ms',
              }}
              onMouseEnter={e => { e.currentTarget.style.background = '#C4530A' }}
              onMouseLeave={e => { e.currentTarget.style.background = '#CC1F28' }}>
              <Download size={16} />
              Download SDS
            </a>
          ) : (
            <div style={{ textAlign: 'right' }}>
              <p style={{ fontSize: '13px', color: '#555', marginBottom: '6px' }}>Contact Bosworth for SDS document</p>
              <a href="mailto:pulleys@bosworth.co.za" style={{ color: '#CC1F28', fontSize: '14px', textDecoration: 'none' }}>
                pulleys@bosworth.co.za
              </a>
            </div>
          )}
        </motion.div>
      </div>
    </section>
  )
}
