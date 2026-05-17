'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { ChevronDown } from 'lucide-react'
import type { Product } from '@/lib/types'

interface ProductHeroProps {
  product: Product
}

export default function ProductHero({ product }: ProductHeroProps) {
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 80)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const badges = ['🔥 FIRE RETARDANT', '☿ MERCURY FREE', '✓ VERSION 2']

  return (
    <section style={{ background: '#FFFFFF', paddingTop: '70px' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: 'clamp(24px, 6vw, 80px)' }}>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4 }}>
          <span
            className="font-display"
            style={{
              background: '#C8102E',
              color: '#FFFFFF',
              fontSize: '13px',
              letterSpacing: '2px',
              padding: '4px 12px',
              display: 'inline-block',
            }}>
            {product.category ?? 'REPAIR KITS'}
          </span>
        </motion.div>

        <motion.h1
          className="font-display"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4, delay: 0.1 }}
          style={{
            fontSize: 'clamp(72px, 14vw, 160px)',
            lineHeight: 0.9,
            color: '#111111',
            marginTop: '24px',
            letterSpacing: '-1px',
          }}>
          {product.name}
        </motion.h1>

        <motion.div
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 0.6, delay: 0.3, ease: 'easeOut' }}
          style={{
            height: '3px',
            background: '#C8102E',
            margin: '32px 0',
            transformOrigin: 'left',
          }}
        />

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4, delay: 0.45 }}
          style={{ display: 'flex', flexWrap: 'wrap', gap: '24px', alignItems: 'flex-start' }}>
          <div style={{ flex: '1 1 280px' }}>
            <p style={{ fontSize: '24px', fontWeight: 300, color: '#444444', lineHeight: 1.4 }}>
              {product.tagline}
            </p>
          </div>
          <div style={{ flex: '1 1 240px', display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            {badges.map(badge => (
              <span
                key={badge}
                style={{
                  background: '#F4F4F4',
                  border: '1px solid #E0E0E0',
                  padding: '8px 16px',
                  fontSize: '12px',
                  fontWeight: 500,
                  color: '#111111',
                  textTransform: 'uppercase',
                  letterSpacing: '0.5px',
                  width: '100%',
                  boxSizing: 'border-box',
                }}>
                {badge}
              </span>
            ))}
          </div>
        </motion.div>

        {product.part_number && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4, delay: 0.55 }}
            style={{
              marginTop: '16px',
              fontSize: '13px',
              color: '#999999',
              fontFamily: 'monospace',
            }}>
            PART NO: {product.part_number}
          </motion.p>
        )}

        {!scrolled && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
            style={{ marginTop: '48px' }}>
            <motion.div
              animate={{ y: [0, 6, 0] }}
              transition={{ repeat: Infinity, duration: 1.4, ease: 'easeInOut' }}
              style={{ display: 'inline-block' }}>
              <ChevronDown size={24} style={{ color: '#C8102E' }} />
            </motion.div>
          </motion.div>
        )}
      </div>
    </section>
  )
}
