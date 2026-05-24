'use client'

import { motion } from 'framer-motion'
import type { TechSpec } from '@/lib/types'

interface TechSpecsProps {
  specs: TechSpec[]
}

export default function TechSpecs({ specs }: TechSpecsProps) {
  if (specs.length === 0) return null

  return (
    <section style={{ background: '#0a0a0a', padding: 'clamp(40px, 6vw, 80px)' }}>
      <div style={{ maxWidth: '900px', margin: '0 auto' }}>
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-50px' }}
          transition={{ duration: 0.4 }}>
          <p style={{ fontSize: '11px', fontWeight: 500, color: '#CC1F28', textTransform: 'uppercase', letterSpacing: '3px', marginBottom: '8px' }}>
            Specifications
          </p>
          <h2 className="font-display" style={{ fontSize: 'clamp(40px, 6vw, 56px)', color: '#f0f0f0', lineHeight: 1 }}>
            Technical Data
          </h2>
          <div style={{ width: '48px', height: '3px', background: '#CC1F28', margin: '16px 0 40px 0' }} />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 8 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-50px' }}
          transition={{ duration: 0.4, delay: 0.1 }}
          style={{
            border: '1px solid #1e1e1e',
            overflow: 'hidden',
          }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <tbody>
              {specs.map((spec, i) => (
                <tr
                  key={spec.id}
                  style={{
                    borderBottom: i < specs.length - 1 ? '1px solid #111' : 'none',
                    background: i % 2 === 0 ? '#0f0f0f' : '#0a0a0a',
                  }}>
                  <td
                    className="font-mono-tech"
                    style={{
                      padding: '14px 20px',
                      fontSize: '12px',
                      color: '#8a9ab0',
                      textTransform: 'uppercase',
                      letterSpacing: '0.5px',
                      width: '45%',
                      borderRight: '1px solid #111',
                      verticalAlign: 'top',
                    }}>
                    {spec.key}
                  </td>
                  <td
                    className="font-mono-tech"
                    style={{
                      padding: '14px 20px',
                      fontSize: '13px',
                      color: '#f0f0f0',
                      verticalAlign: 'top',
                    }}>
                    {spec.value}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </motion.div>
      </div>
    </section>
  )
}
