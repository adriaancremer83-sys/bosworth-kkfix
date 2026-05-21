'use client'

import { motion } from 'framer-motion'
import {
  FlaskConical, Zap, Droplets, Layers, Shield,
  Paintbrush, RefreshCw, Package, Box,
} from 'lucide-react'
import type { KitContent } from '@/lib/types'

interface KitContentsProps {
  items: KitContent[]
}

function getIcon(name: string) {
  const l = name.toLowerCase()
  if (l.includes('compound') || l.includes('resin') || l.includes('polyether')) return FlaskConical
  if (l.includes('hardener')) return Zap
  if (l.includes('solvent') || l.includes('cleaner')) return Droplets
  if (l.includes('fabric')) return Layers
  if (l.includes('glove')) return Shield
  if (l.includes('spatula')) return Paintbrush
  if (l.includes('stirrer')) return RefreshCw
  if (l.includes('packag')) return Package
  return Box
}

export default function KitContents({ items }: KitContentsProps) {
  return (
    <section id="kit-contents" style={{ background: '#111111', padding: 'clamp(40px, 6vw, 80px)' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-50px' }}
          transition={{ duration: 0.4 }}>
          <p style={{
            fontSize: '11px',
            fontWeight: 500,
            color: '#E8650A',
            textTransform: 'uppercase',
            letterSpacing: '3px',
            marginBottom: '8px',
          }}>
            Kit Contents
          </p>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <h2 className="font-display" style={{ fontSize: 'clamp(40px, 6vw, 56px)', color: '#f0f0f0', lineHeight: 1 }}>
              What&apos;s in the Bag
            </h2>
            <span
              className="font-display"
              style={{
                background: '#E8650A',
                color: '#fff',
                fontSize: '20px',
                padding: '2px 10px',
              }}>
              {items.length}
            </span>
          </div>
          <div style={{ width: '48px', height: '3px', background: '#E8650A', margin: '16px 0 40px 0' }} />
        </motion.div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))',
          gap: '12px',
        }}>
          {items.map((item, i) => {
            const Icon = getIcon(item.item_name)
            return (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-50px' }}
                transition={{ duration: 0.4, delay: i * 0.07 }}
                style={{
                  background: '#1a1a1a',
                  border: '1px solid #2a2a2a',
                  borderTop: '3px solid #E8650A',
                  padding: '24px',
                  position: 'relative',
                  transition: 'transform 150ms, box-shadow 150ms, border-color 150ms',
                  cursor: 'default',
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.transform = 'translateY(-3px)'
                  e.currentTarget.style.boxShadow = '0 8px 24px rgba(232,101,10,0.12)'
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.transform = 'translateY(0)'
                  e.currentTarget.style.boxShadow = 'none'
                }}>
                {item.image_url ? (
                  <img
                    src={item.image_url}
                    alt={item.item_name}
                    style={{ width: '100%', height: '120px', objectFit: 'contain', marginBottom: '12px' }}
                  />
                ) : (
                  <Icon size={22} style={{ color: '#E8650A' }} />
                )}

                <span
                  className="font-display"
                  style={{
                    position: 'absolute',
                    top: '12px',
                    right: '14px',
                    fontSize: '40px',
                    color: '#2a2a2a',
                    lineHeight: 1,
                    userSelect: 'none',
                  }}>
                  {String(i + 1).padStart(2, '0')}
                </span>

                <p style={{ fontSize: '14px', fontWeight: 600, color: '#f0f0f0', marginTop: '12px' }}>
                  {item.item_name}
                </p>
                {item.item_description && (
                  <p style={{ fontSize: '12px', color: '#8a9ab0', marginTop: '4px', lineHeight: 1.5 }}>
                    {item.item_description}
                  </p>
                )}
                {item.quantity && (
                  <span style={{
                    display: 'inline-block',
                    marginTop: '12px',
                    fontSize: '11px',
                    fontWeight: 600,
                    color: '#E8650A',
                    background: 'rgba(232,101,10,0.1)',
                    padding: '2px 8px',
                    letterSpacing: '0.5px',
                  }}>
                    {item.quantity}
                  </span>
                )}
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
