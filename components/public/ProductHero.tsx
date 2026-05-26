'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { ChevronDown } from 'lucide-react'
import Image from 'next/image'
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
        paddingTop: '64px',
        minHeight: '100svh',
        display: 'flex',
        alignItems: 'center',
        position: 'relative',
        overflow: 'hidden',
      }}>
      {/* Hero background image */}
      <Image
        src="/images/hero.png"
        alt=""
        fill
        priority
        sizes="100vw"
        style={{ objectFit: 'cover', objectPosition: 'center' }}
      />

      {/* Dark overlay so text stays readable over the image */}
      <div
        aria-hidden
        style={{
          position: 'absolute',
          inset: 0,
          background: 'linear-gradient(180deg, rgba(0,0,0,0.62) 0%, rgba(0,0,0,0.75) 100%)',
        }}
      />

      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: 'clamp(40px, 6vw, 80px)', width: '100%', position: 'relative', zIndex: 2 }}>
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}>
          <span
            className="font-display"
            style={{
              background: '#CC1F28',
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
              fontWeight: 900,
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

        {/* CLEAN. FAST. RELIABLE. tagline */}
        <motion.p
          className="font-display"
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.28 }}
          style={{
            fontSize: 'clamp(22px, 4vw, 40px)',
            fontWeight: 700,
            color: '#ffffff',
            letterSpacing: '0.08em',
            textTransform: 'uppercase',
            margin: '20px 0 0',
          }}>
          Clean.{' '}
          <span style={{ color: '#CC1F28' }}>Fast.</span>{' '}
          Reliable.
        </motion.p>

        <motion.div
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 0.6, delay: 0.35, ease: 'easeOut' }}
          style={{
            height: '3px',
            background: '#CC1F28',
            margin: '24px 0',
            transformOrigin: 'left',
            maxWidth: '480px',
          }}
        />

        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.44 }}
          style={{ display: 'flex', flexWrap: 'wrap', gap: '32px', alignItems: 'flex-start' }}>
          <div style={{ flex: '1 1 300px' }}>
            <p style={{ fontSize: 'clamp(16px, 2.5vw, 20px)', fontWeight: 400, color: '#8a9ab0', lineHeight: 1.7 }}>
              {product.tagline}
            </p>
            {(product as any).subtitle && (
              <p style={{ fontSize: '16px', color: '#555', marginTop: '8px', lineHeight: 1.7 }}>
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
            transition={{ duration: 0.4, delay: 0.55 }}
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
            transition={{ duration: 0.4, delay: 0.60 }}
            className="font-display"
            style={{
              background: '#CC1F28',
              color: '#fff',
              padding: '14px 32px',
              fontSize: '16px',
              letterSpacing: '2px',
              textDecoration: 'none',
              display: 'inline-block',
              transition: 'background 150ms',
            }}
            onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = '#a31820' }}
            onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = '#CC1F28' }}>
            VIEW INSTRUCTIONS ↓
          </motion.a>
          <motion.a
            href={product.msds_url ?? '/msds/kk-fix-msds.pdf'}
            target="_blank"
            rel="noopener noreferrer"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.67 }}
            className="font-display"
            style={{
              border: '1px solid #CC1F28',
              color: '#CC1F28',
              padding: '14px 32px',
              fontSize: '16px',
              letterSpacing: '2px',
              textDecoration: 'none',
              display: 'inline-block',
              transition: 'background 150ms, color 150ms',
            }}
            onMouseEnter={e => {
              (e.currentTarget as HTMLElement).style.background = '#CC1F28'
              ;(e.currentTarget as HTMLElement).style.color = '#fff'
            }}
            onMouseLeave={e => {
              (e.currentTarget as HTMLElement).style.background = 'transparent'
              ;(e.currentTarget as HTMLElement).style.color = '#CC1F28'
            }}>
            DOWNLOAD MSDS
          </motion.a>
          <motion.a
            href="#kit-builder"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.74 }}
            className="font-display"
            style={{
              border: '1px solid #2a2a2a',
              color: '#8a9ab0',
              padding: '14px 32px',
              fontSize: '16px',
              letterSpacing: '2px',
              textDecoration: 'none',
              display: 'inline-block',
              transition: 'border-color 150ms, color 150ms',
            }}
            onMouseEnter={e => {
              (e.currentTarget as HTMLElement).style.borderColor = '#CC1F28'
              ;(e.currentTarget as HTMLElement).style.color = '#CC1F28'
            }}
            onMouseLeave={e => {
              (e.currentTarget as HTMLElement).style.borderColor = '#2a2a2a'
              ;(e.currentTarget as HTMLElement).style.color = '#8a9ab0'
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
              <ChevronDown size={24} style={{ color: '#CC1F28' }} />
            </motion.div>
          </motion.div>
        )}
      </div>
    </section>
  )
}
