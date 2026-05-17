'use client'

import { motion } from 'framer-motion'
import { Download } from 'lucide-react'

interface MSDSDownloadProps {
  msdsUrl: string | null
}

export default function MSDSDownload({ msdsUrl }: MSDSDownloadProps) {
  return (
    <section style={{ background: '#111111', padding: '60px 80px' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '40px' }}>
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, margin: '-50px' }}
          transition={{ duration: 0.4 }}>
          <h2 className="font-display" style={{ fontSize: '36px', color: '#FFFFFF', lineHeight: 1 }}>
            Material Safety Data Sheet
          </h2>
          <p style={{ fontSize: '14px', fontWeight: 300, color: '#888888', marginTop: '8px' }}>
            Version 2 — Mercury Free — November 2025
          </p>
          <p style={{ fontSize: '12px', fontWeight: 300, color: '#666666', marginTop: '4px' }}>
            Prepared by A. Pieterse | Approved by L. van der Vyver
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
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
                background: '#C8102E',
                color: '#FFFFFF',
                fontSize: '18px',
                letterSpacing: '1px',
                padding: '16px 40px',
                borderRadius: '4px',
                textDecoration: 'none',
                transition: 'background 150ms',
              }}
              onMouseEnter={e => { e.currentTarget.style.background = '#A50D24' }}
              onMouseLeave={e => { e.currentTarget.style.background = '#C8102E' }}>
              <Download size={18} />
              Download SDS
            </a>
          ) : (
            <div style={{ textAlign: 'right' }}>
              <p style={{ fontSize: '13px', color: '#888888', marginBottom: '6px' }}>Contact Bosworth for SDS document</p>
              <a href="mailto:pulleys@bosworth.co.za" style={{ color: '#C8102E', fontSize: '14px' }}>
                pulleys@bosworth.co.za
              </a>
            </div>
          )}
        </motion.div>
      </div>
    </section>
  )
}
