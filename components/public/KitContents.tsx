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
    <section style={{ background: '#FFFFFF', padding: '80px' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, margin: '-50px' }}
          transition={{ duration: 0.4 }}
          style={{ display: 'flex', alignItems: 'baseline', gap: '16px', marginBottom: '8px' }}>
          <p style={{
            fontSize: '12px',
            fontWeight: 500,
            color: '#C8102E',
            textTransform: 'uppercase',
            letterSpacing: '3px',
          }}>
            Kit Contents
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, margin: '-50px' }}
          transition={{ duration: 0.4 }}
          style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <h2 className="font-display" style={{ fontSize: '56px', color: '#111111', lineHeight: 1 }}>
            What&apos;s in the Box
          </h2>
          <span
            className="font-display"
            style={{
              background: '#C8102E',
              color: '#FFFFFF',
              fontSize: '20px',
              padding: '2px 10px',
              borderRadius: '2px',
            }}>
            {items.length}
          </span>
        </motion.div>

        <div style={{ width: '60px', height: '3px', background: '#C8102E', margin: '16px 0 40px 0' }} />

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(4, 1fr)',
          gap: '16px',
        }}>
          {items.map((item, i) => {
            const Icon = getIcon(item.item_name)
            return (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-50px' }}
                transition={{ duration: 0.4, delay: i * 0.08 }}
                style={{
                  background: '#FFFFFF',
                  border: '1px solid #E8E8E8',
                  borderTop: '3px solid #C8102E',
                  padding: '24px',
                  borderRadius: '4px',
                  position: 'relative',
                  cursor: 'default',
                  transition: 'transform 150ms, box-shadow 150ms',
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.transform = 'translateY(-3px)'
                  e.currentTarget.style.boxShadow = '0 8px 24px rgba(0,0,0,0.1)'
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.transform = 'translateY(0)'
                  e.currentTarget.style.boxShadow = 'none'
                }}>
                <span
                  className="font-display"
                  style={{
                    position: 'absolute',
                    top: '12px',
                    right: '16px',
                    fontSize: '48px',
                    color: '#E8E8E8',
                    lineHeight: 1,
                    userSelect: 'none',
                  }}>
                  {String(i + 1).padStart(2, '0')}
                </span>

                <Icon size={24} style={{ color: '#C8102E' }} />

                <p style={{ fontSize: '15px', fontWeight: 600, color: '#111111', marginTop: '12px' }}>
                  {item.item_name}
                </p>
                {item.item_description && (
                  <p style={{ fontSize: '13px', fontWeight: 400, color: '#666666', marginTop: '4px' }}>
                    {item.item_description}
                  </p>
                )}
                {item.quantity && (
                  <span style={{
                    display: 'inline-block',
                    marginTop: '12px',
                    fontSize: '11px',
                    fontWeight: 500,
                    color: '#C8102E',
                    background: '#FFF0F0',
                    padding: '2px 8px',
                    borderRadius: '2px',
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
