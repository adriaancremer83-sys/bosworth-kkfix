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

  const badges: string[] = (product as any).badges ?? ['FIRE RETARDANT', 'MERCURY FREE', 'VERSION 2']

  return (
    <section
      style={{
        background: 'linear-gradient(180deg, #0d0d0d 0%, #0a0a0a 100%)',
        paddingTop: '64px',
        minHeight: '100svh',
        display: 'flex',
        alignItems: 'center',
        position: 'relative',
        overflow: 'hidden',
      }}>
      {/* subtle grain overlay */}
      <div
        aria-hidden
        style={{
          position: 'absolute',
          inset: 0,
          backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 200 200\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'n\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.9\' numOctaves=\'4\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23n)\' opacity=\'0.04\'/%3E%3C/svg%3E")',
          backgroundSize: '200px',
          pointerEvents: 'none',
          opacity: 0.6,
        }}
      />

      {/* orange glow top-left */}
      <div
        aria-hidden
        style={{
          position: 'absolute',
          top: '-100px',
          left: '-100px',
          width: '400px',
          height: '400px',
          background: 'radial-gradient(circle, rgba(232,101,10,0.08) 0%, transparent 70%)',
          pointerEvents: 'none',
        }}
      />

      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: 'clamp(40px, 6vw, 80px)', width: '100%', position: 'relative', zIndex: 1 }}>
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}>
          <span
            className="font-display"
            style={{
              background: '#E8650A',
              color: '#FFFFFF',
              fontSize: '12px',
              letterSpacing: '3px',
              padding: '4px 12px',
              display: 'inline-block',
              textTransform: 'uppercase',
            }}>
            {product.category ?? 'REPAIR KITS'}
          </span>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, delay: 0.08 }}
          style={{ marginTop: '20px' }}>
          <h1
            className="font-display"
            style={{
              fontSize: 'clamp(80px, 16vw, 180px)',
              lineHeight: 0.88,
              color: '#f0f0f0',
              letterSpacing: '-1px',
            }}>
            KK-FIX
          </h1>
          <p
            className="font-display"
            style={{
              fontSize: 'clamp(20px, 4vw, 36px)',
              color: '#8a9ab0',
              letterSpacing: '6px',
              textTransform: 'uppercase',
              marginTop: '4px',
            }}>
            by BOSWORTH
          </p>
        </motion.div>

        <motion.div
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 0.6, delay: 0.25, ease: 'easeOut' }}
          style={{
            height: '3px',
            background: '#E8650A',
            margin: '28px 0',
            transformOrigin: 'left',
            maxWidth: '480px',
          }}
        />

        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.38 }}
          style={{ display: 'flex', flexWrap: 'wrap', gap: '32px', alignItems: 'flex-start' }}>
          <div style={{ flex: '1 1 300px' }}>
            <p style={{ fontSize: 'clamp(16px, 2.5vw, 22px)', fontWeight: 300, color: '#8a9ab0', lineHeight: 1.5 }}>
              {product.tagline}
            </p>
            {(product as any).subtitle && (
              <p style={{ fontSize: '14px', color: '#555', marginTop: '8px', lineHeight: 1.6 }}>
                {(product as any).subtitle}
              </p>
            )}
          </div>

          <div style={{ flex: '0 1 auto', display: 'flex', flexDirection: 'column', gap: '8px', minWidth: '180px' }}>
            {badges.map((badge: string) => (
              <span
                key={badge}
                style={{
                  background: '#111111',
                  border: '1px solid #2a2a2a',
                  padding: '8px 16px',
                  fontSize: '11px',
                  fontWeight: 500,
                  color: '#8a9ab0',
                  textTransform: 'uppercase',
                  letterSpacing: '1.5px',
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
            transition={{ duration: 0.4, delay: 0.5 }}
            className="font-mono-tech"
            style={{
              marginTop: '20px',
              fontSize: '12px',
              color: '#444',
              letterSpacing: '1px',
            }}>
            PART NO: {product.part_number}
          </motion.p>
        )}

        <div style={{ display: 'flex', gap: '16px', marginTop: '40px', flexWrap: 'wrap' }}>
          <motion.a
            href="#instructions"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.55 }}
            className="font-display"
            style={{
              background: '#E8650A',
              color: '#fff',
              padding: '14px 32px',
              fontSize: '16px',
              letterSpacing: '2px',
              textDecoration: 'none',
              display: 'inline-block',
              transition: 'background 150ms',
            }}
            onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = '#C4530A' }}
            onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = '#E8650A' }}>
            VIEW INSTRUCTIONS ↓
          </motion.a>
          <motion.a
            href="#kit-builder"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.62 }}
            className="font-display"
            style={{
              border: '1px solid #E8650A',
              color: '#E8650A',
              padding: '14px 32px',
              fontSize: '16px',
              letterSpacing: '2px',
              textDecoration: 'none',
              display: 'inline-block',
              transition: 'background 150ms, color 150ms',
            }}
            onMouseEnter={e => {
              (e.currentTarget as HTMLElement).style.background = '#E8650A'
              ;(e.currentTarget as HTMLElement).style.color = '#fff'
            }}
            onMouseLeave={e => {
              (e.currentTarget as HTMLElement).style.background = 'transparent'
              ;(e.currentTarget as HTMLElement).style.color = '#E8650A'
            }}>
            BUILD YOUR KIT →
          </motion.a>
        </div>

        {!scrolled && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
            style={{ marginTop: '60px' }}>
            <motion.div
              animate={{ y: [0, 6, 0] }}
              transition={{ repeat: Infinity, duration: 1.4, ease: 'easeInOut' }}
              style={{ display: 'inline-block' }}>
              <ChevronDown size={24} style={{ color: '#E8650A' }} />
            </motion.div>
          </motion.div>
        )}
      </div>
    </section>
  )
}
