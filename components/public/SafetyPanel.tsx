'use client'

import { motion } from 'framer-motion'
import {
  Flame, AlertOctagon, Leaf, ShieldCheck,
  Eye, Wind, Trash2, AlertTriangle,
} from 'lucide-react'
import type { SafetyItem } from '@/lib/types'

interface SafetyPanelProps {
  items: SafetyItem[]
}

function getIcon(iconName: string, type: SafetyItem['type']) {
  const l = iconName.toLowerCase()
  if (l.includes('flame')) return Flame
  if (l.includes('alert-octagon')) return AlertOctagon
  if (l.includes('leaf')) return Leaf
  if (l.includes('shield')) return ShieldCheck
  if (l.includes('eye')) return Eye
  if (l.includes('wind')) return Wind
  if (l.includes('trash')) return Trash2
  if (type === 'hazard') return AlertOctagon
  if (type === 'ppe') return ShieldCheck
  if (type === 'disposal') return Trash2
  return AlertTriangle
}

const typeStyles: Record<SafetyItem['type'], { bg: string; leftBorder: string; iconColor: string }> = {
  hazard:  { bg: '#FFF5F5', leftBorder: '#C8102E', iconColor: '#C8102E' },
  ppe:     { bg: '#EFF6FF', leftBorder: '#1D4ED8', iconColor: '#1D4ED8' },
  warning: { bg: '#FFFBEB', leftBorder: '#D97706', iconColor: '#D97706' },
  disposal:{ bg: '#F0FDF4', leftBorder: '#16A34A', iconColor: '#16A34A' },
}

function SafetyCard({ item, index }: { item: SafetyItem; index: number }) {
  const Icon = getIcon(item.icon, item.type)
  const s = typeStyles[item.type]
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 0.4, delay: index * 0.08 }}
      style={{
        background: s.bg,
        borderLeft: `3px solid ${s.leftBorder}`,
        borderRadius: '4px',
        padding: '20px 24px',
        marginBottom: '12px',
        display: 'flex',
        gap: '16px',
        alignItems: 'flex-start',
      }}>
      <Icon size={20} style={{ color: s.iconColor, flexShrink: 0, marginTop: '2px' }} />
      <div>
        <p style={{ fontSize: '14px', fontWeight: 600, color: '#111111' }}>{item.label}</p>
        {item.description && (
          <p style={{ fontSize: '13px', fontWeight: 400, color: '#666666', marginTop: '2px' }}>
            {item.description}
          </p>
        )}
      </div>
    </motion.div>
  )
}

export default function SafetyPanel({ items }: SafetyPanelProps) {
  const hazardItems = items.filter(i => i.type === 'hazard' || i.type === 'warning')
  const ppeItems = items.filter(i => i.type === 'ppe' || i.type === 'disposal')

  const firstAid = [
    { label: 'Skin',       action: 'Wash with soap and water for at least 15 minutes.',  icon: '🖐' },
    { label: 'Eyes',       action: 'Rinse with clean water for 15 minutes. Seek medical attention.', icon: '👁' },
    { label: 'Inhalation', action: 'Move to fresh air immediately. Rest and keep warm.',  icon: '💨' },
    { label: 'Ingestion',  action: 'Do NOT induce vomiting. Seek immediate medical attention.', icon: '🚨' },
  ]

  return (
    <>
      <section style={{ background: '#FFFFFF', padding: '80px' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true, margin: '-50px' }}
            transition={{ duration: 0.4 }}>
            <p style={{ fontSize: '12px', fontWeight: 500, color: '#C8102E', textTransform: 'uppercase', letterSpacing: '3px', marginBottom: '8px' }}>
              Safety
            </p>
            <h2 className="font-display" style={{ fontSize: '56px', color: '#111111', lineHeight: 1 }}>
              Safety Information
            </h2>
            <div style={{ width: '60px', height: '3px', background: '#C8102E', margin: '16px 0 40px 0' }} />
          </motion.div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '32px' }}>
            <div>
              <p style={{ fontSize: '12px', fontWeight: 700, color: '#C8102E', textTransform: 'uppercase', letterSpacing: '3px', marginBottom: '16px' }}>
                Hazards &amp; Warnings
              </p>
              {hazardItems.map((item, i) => <SafetyCard key={item.id} item={item} index={i} />)}
            </div>
            <div>
              <p style={{ fontSize: '12px', fontWeight: 700, color: '#1D4ED8', textTransform: 'uppercase', letterSpacing: '3px', marginBottom: '16px' }}>
                PPE &amp; Disposal
              </p>
              {ppeItems.map((item, i) => <SafetyCard key={item.id} item={item} index={i} />)}
            </div>
          </div>
        </div>
      </section>

      <section style={{ background: '#F4F4F4', padding: '60px 80px' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true, margin: '-50px' }}
            transition={{ duration: 0.4 }}>
            <p style={{ fontSize: '12px', fontWeight: 500, color: '#C8102E', textTransform: 'uppercase', letterSpacing: '3px', marginBottom: '8px' }}>
              Emergency
            </p>
            <h3 className="font-display" style={{ fontSize: '40px', color: '#111111', marginBottom: '32px' }}>
              First Aid
            </h3>
          </motion.div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px' }}>
            {firstAid.map((fa, i) => (
              <motion.div
                key={fa.label}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-50px' }}
                transition={{ duration: 0.4, delay: i * 0.08 }}
                style={{
                  background: '#FFFFFF',
                  border: '1px solid #E8E8E8',
                  padding: '20px',
                  borderRadius: '4px',
                }}>
                <div style={{ fontSize: '24px', marginBottom: '12px' }}>{fa.icon}</div>
                <p style={{ fontSize: '14px', fontWeight: 600, color: '#111111', marginBottom: '6px' }}>{fa.label}</p>
                <p style={{ fontSize: '13px', fontWeight: 400, color: '#666666', lineHeight: 1.5 }}>{fa.action}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}
