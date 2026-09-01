'use client'

import { motion } from 'framer-motion'
import { Download, FileText } from 'lucide-react'

interface Doc {
  title: string
  meta: string
  url: string
  note?: string
}

export default function Documentation({ docs }: { docs: Doc[] }) {
  if (!docs.length) return null

  return (
    <section
      id="documentation"
      style={{
        background: '#111111',
        borderTop: '1px solid #1e1e1e',
        padding: 'clamp(48px, 7vw, 72px) clamp(24px, 6vw, 80px)',
      }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-50px' }}
          transition={{ duration: 0.4 }}>
          <p
            style={{
              fontSize: '11px',
              color: '#CC1F28',
              textTransform: 'uppercase',
              letterSpacing: '3px',
              marginBottom: '8px',
              fontWeight: 500,
            }}>
            Documentation
          </p>
          <h2 className="font-display" style={{ fontSize: 'clamp(28px, 4vw, 40px)', color: '#f0f0f0', lineHeight: 1 }}>
            Data sheets &amp; test reports
          </h2>
        </motion.div>

        <div style={{ marginTop: '32px', display: 'grid', gap: '1px', background: '#1e1e1e', border: '1px solid #1e1e1e' }}>
          {docs.map((d, i) => (
            <motion.div
              key={d.url}
              initial={{ opacity: 0, y: 8 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ duration: 0.35, delay: i * 0.06 }}
              style={{
                background: '#0f0f0f',
                padding: 'clamp(18px, 3vw, 26px)',
                display: 'flex',
                flexWrap: 'wrap',
                gap: '20px',
                alignItems: 'flex-start',
                justifyContent: 'space-between',
              }}>
              <div style={{ minWidth: 0, flex: '1 1 320px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <FileText size={16} style={{ color: '#CC1F28', flexShrink: 0 }} />
                  <h3 className="font-display" style={{ fontSize: '17px', color: '#f0f0f0', letterSpacing: '0.5px' }}>
                    {d.title}
                  </h3>
                </div>
                <p style={{ fontSize: '12.5px', color: '#777', marginTop: '7px', fontFamily: 'monospace' }}>{d.meta}</p>
                {d.note && (
                  <p style={{ fontSize: '13px', color: '#8a8a8a', marginTop: '10px', lineHeight: 1.6, maxWidth: '60ch' }}>
                    {d.note}
                  </p>
                )}
              </div>
              <a
                href={d.url}
                target="_blank"
                rel="noopener noreferrer"
                className="font-display"
                style={{
                  flexShrink: 0,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '9px',
                  background: '#CC1F28',
                  color: '#fff',
                  fontSize: '14px',
                  letterSpacing: '1.5px',
                  padding: '12px 26px',
                  textDecoration: 'none',
                  transition: 'background 150ms',
                }}
                onMouseEnter={e => { e.currentTarget.style.background = '#a31820' }}
                onMouseLeave={e => { e.currentTarget.style.background = '#CC1F28' }}>
                <Download size={15} />
                PDF
              </a>
            </motion.div>
          ))}
        </div>

        <p style={{ fontSize: '11.5px', color: '#555', marginTop: '18px', lineHeight: 1.6, maxWidth: '70ch' }}>
          Test reports are reproduced in full and remain the property of the issuing body. For the
          current controlled documents, contact Bosworth.
        </p>
      </div>
    </section>
  )
}
