'use client'

import { motion } from 'framer-motion'
import {
  Flame, AlertOctagon, Leaf, ShieldCheck,
  Eye, Wind, Trash2, AlertTriangle, Hand,
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

const typeStyles: Record<SafetyItem['type'], { bg: string; border: string; iconColor: string }> = {
  hazard:  { bg: 'rgba(232,101,10,0.06)', border: '#CC1F28', iconColor: '#CC1F28' },
  ppe:     { bg: 'rgba(29,78,216,0.06)',  border: '#3b82f6', iconColor: '#3b82f6' },
  warning: { bg: 'rgba(245,158,11,0.06)', border: '#f59e0b', iconColor: '#f59e0b' },
  disposal:{ bg: 'rgba(34,197,94,0.06)',  border: '#22c55e', iconColor: '#22c55e' },
}

function SafetyCard({ item, index }: { item: SafetyItem; index: number }) {
  const Icon = getIcon(item.icon, item.type)
  const s = typeStyles[item.type]
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 0.35, delay: index * 0.07 }}
      style={{
        background: s.bg,
        borderLeft: `3px solid ${s.border}`,
        padding: '18px 20px',
        marginBottom: '10px',
        display: 'flex',
        gap: '14px',
        alignItems: 'flex-start',
      }}>
      <Icon size={20} style={{ color: s.iconColor, flexShrink: 0, marginTop: '2px' }} />
      <div>
        <p style={{ fontSize: '15px', fontWeight: 600, color: '#f0f0f0' }}>{item.label}</p>
        {item.description && (
          <p style={{ fontSize: '15px', color: '#8a9ab0', marginTop: '4px', lineHeight: 1.7 }}>
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
    { label: 'Skin',       action: 'Wash with soap and water for at least 15 minutes.',               Icon: Hand },
    { label: 'Eyes',       action: 'Rinse with clean water for 15 minutes. Seek medical attention.',  Icon: Eye },
    { label: 'Inhalation', action: 'Move to fresh air immediately. Rest and keep warm.',              Icon: Wind },
    { label: 'Ingestion',  action: 'Do NOT induce vomiting. Seek immediate medical attention.',       Icon: AlertTriangle },
  ]

  return (
    <>
      <section style={{ background: '#111111', padding: 'clamp(40px, 6vw, 80px)' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-50px' }}
            transition={{ duration: 0.4 }}>
            <p style={{ fontSize: '11px', fontWeight: 500, color: '#CC1F28', textTransform: 'uppercase', letterSpacing: '3px', marginBottom: '8px' }}>
              Safety
            </p>
            <h2 className="font-display" style={{ fontSize: 'clamp(40px, 6vw, 56px)', color: '#f0f0f0', lineHeight: 1, fontWeight: 800, textTransform: 'uppercase' }}>
              Safety Information
            </h2>
            <div style={{ width: '48px', height: '3px', background: '#CC1F28', margin: '16px 0 40px 0' }} />
          </motion.div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '32px' }}>
            <div>
              <p style={{ fontSize: '11px', fontWeight: 700, color: '#CC1F28', textTransform: 'uppercase', letterSpacing: '3px', marginBottom: '16px' }}>
                Hazards &amp; Warnings
              </p>
              {hazardItems.map((item, i) => <SafetyCard key={item.id} item={item} index={i} />)}
            </div>
            <div>
              <p style={{ fontSize: '11px', fontWeight: 700, color: '#3b82f6', textTransform: 'uppercase', letterSpacing: '3px', marginBottom: '16px' }}>
                PPE &amp; Disposal
              </p>
              {ppeItems.map((item, i) => <SafetyCard key={item.id} item={item} index={i} />)}
            </div>
          </div>
        </div>
      </section>

      <section style={{ background: '#0a0a0a', padding: 'clamp(40px, 6vw, 60px) clamp(24px, 6vw, 80px)' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-50px' }}
            transition={{ duration: 0.4 }}>
            <p style={{ fontSize: '11px', fontWeight: 500, color: '#CC1F28', textTransform: 'uppercase', letterSpacing: '3px', marginBottom: '8px' }}>
              Emergency
            </p>
            <h3 className="font-display" style={{ fontSize: 'clamp(32px, 4vw, 44px)', color: '#f0f0f0', marginBottom: '32px', fontWeight: 800, textTransform: 'uppercase' }}>
              First Aid
            </h3>
          </motion.div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '16px' }}>
            {firstAid.map((fa, i) => (
              <motion.div
                key={fa.label}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-50px' }}
                transition={{ duration: 0.35, delay: i * 0.08 }}
                style={{
                  background: '#111111',
                  border: '1px solid #1e1e1e',
                  borderTop: '2px solid #CC1F28',
                  padding: '24px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '12px',
                }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div style={{ width: '40px', height: '40px', background: 'rgba(204,31,40,0.1)', border: '1px solid rgba(204,31,40,0.25)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <fa.Icon size={20} style={{ color: '#CC1F28' }} />
                  </div>
                  <p style={{ fontSize: '15px', fontWeight: 700, color: '#f0f0f0', textTransform: 'uppercase', letterSpacing: '1.5px', fontFamily: 'Barlow Condensed, sans-serif' }}>{fa.label}</p>
                </div>
                <p style={{ fontSize: '15px', color: '#8a9ab0', lineHeight: 1.7 }}>{fa.action}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}
