'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Image from 'next/image'
import { ChevronLeft, ChevronRight } from 'lucide-react'

const IMAGES = Array.from({ length: 27 }, (_, i) => ({
  src: `/images/gallery${i + 1}.jpeg`,
  alt: `KK-Fix conveyor belt repair in the field — image ${i + 1}`,
}))

const variants = {
  enter: (dir: number) => ({ x: dir > 0 ? '100%' : '-100%', opacity: 0 }),
  center: { x: 0, opacity: 1 },
  exit:  (dir: number) => ({ x: dir > 0 ? '-100%' : '100%', opacity: 0 }),
}

export default function Gallery() {
  const [current, setCurrent] = useState(0)
  const [direction, setDir]   = useState(1)
  const timerRef              = useRef<ReturnType<typeof setInterval> | null>(null)
  const touchStartX           = useRef<number | null>(null)

  const startTimer = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current)
    timerRef.current = setInterval(() => {
      setDir(1)
      setCurrent(prev => (prev + 1) % IMAGES.length)
    }, 4000)
  }, [])

  useEffect(() => {
    startTimer()
    return () => { if (timerRef.current) clearInterval(timerRef.current) }
  }, [startTimer])

  function go(newIdx: number, dir: number) {
    setDir(dir)
    setCurrent((newIdx + IMAGES.length) % IMAGES.length)
    startTimer()
  }

  const next = () => go(current + 1,  1)
  const prev = () => go(current - 1, -1)

  return (
    <section style={{ background: '#0a0a0a', padding: 'clamp(40px, 6vw, 80px) 0' }}>
      {/* Heading */}
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 clamp(24px, 6vw, 80px)', marginBottom: '32px' }}>
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-50px' }}
          transition={{ duration: 0.4 }}
        >
          <p style={{ fontSize: '11px', fontWeight: 500, color: '#CC1F28', textTransform: 'uppercase', letterSpacing: '3px', marginBottom: '8px' }}>
            Gallery
          </p>
          <h2
            className="font-display"
            style={{ fontSize: 'clamp(40px, 6vw, 56px)', color: '#f0f0f0', lineHeight: 1, fontWeight: 800, textTransform: 'uppercase' }}
          >
            In The Field
          </h2>
          <div style={{ width: '48px', height: '3px', background: '#CC1F28', marginTop: '16px' }} />
        </motion.div>
      </div>

      {/* Carousel */}
      <div
        style={{ position: 'relative', aspectRatio: '16/9', overflow: 'hidden', background: '#111', touchAction: 'pan-y' }}
        onPointerDown={e => { touchStartX.current = e.clientX }}
        onPointerUp={e => {
          if (touchStartX.current === null) return
          const delta = e.clientX - touchStartX.current
          if (Math.abs(delta) > 50) { delta < 0 ? next() : prev() }
          touchStartX.current = null
        }}
      >
        {/* Image counter */}
        <div style={{
          position: 'absolute', top: '16px', right: '20px', zIndex: 10,
          background: 'rgba(0,0,0,0.65)', backdropFilter: 'blur(4px)',
          color: '#f0f0f0', fontSize: '13px', fontWeight: 600,
          padding: '5px 14px', fontFamily: 'Barlow Condensed, sans-serif', letterSpacing: '1px',
        }}>
          {current + 1} / {IMAGES.length}
        </div>

        {/* Left arrow */}
        <button
          onClick={prev}
          aria-label="Previous image"
          style={{
            position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)',
            zIndex: 10, background: 'rgba(0,0,0,0.55)', border: 'none', color: '#f0f0f0',
            width: '48px', height: '48px', display: 'flex', alignItems: 'center', justifyContent: 'center',
            cursor: 'pointer', transition: 'background 150ms',
          }}
          onMouseEnter={e => { e.currentTarget.style.background = 'rgba(204,31,40,0.75)' }}
          onMouseLeave={e => { e.currentTarget.style.background = 'rgba(0,0,0,0.55)' }}
        >
          <ChevronLeft size={24} />
        </button>

        {/* Right arrow */}
        <button
          onClick={next}
          aria-label="Next image"
          style={{
            position: 'absolute', right: '16px', top: '50%', transform: 'translateY(-50%)',
            zIndex: 10, background: 'rgba(0,0,0,0.55)', border: 'none', color: '#f0f0f0',
            width: '48px', height: '48px', display: 'flex', alignItems: 'center', justifyContent: 'center',
            cursor: 'pointer', transition: 'background 150ms',
          }}
          onMouseEnter={e => { e.currentTarget.style.background = 'rgba(204,31,40,0.75)' }}
          onMouseLeave={e => { e.currentTarget.style.background = 'rgba(0,0,0,0.55)' }}
        >
          <ChevronRight size={24} />
        </button>

        {/* Slides */}
        <AnimatePresence initial={false} custom={direction} mode="popLayout">
          <motion.div
            key={current}
            custom={direction}
            variants={variants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
            style={{ position: 'absolute', inset: 0 }}
          >
            <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.4) 0%, transparent 45%)', zIndex: 1 }} />
            <Image
              src={IMAGES[current].src}
              alt={IMAGES[current].alt}
              fill
              sizes="100vw"
              style={{ objectFit: 'cover' }}
              priority={current === 0}
            />
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Dot indicators */}
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '20px clamp(24px, 6vw, 80px) 0' }}>
        <div style={{ display: 'flex', gap: '5px', justifyContent: 'center', flexWrap: 'wrap' }}>
          {IMAGES.map((_, i) => (
            <button
              key={i}
              onClick={() => go(i, i > current ? 1 : -1)}
              aria-label={`Go to image ${i + 1}`}
              style={{
                width: i === current ? '22px' : '6px',
                height: '6px',
                background: i === current ? '#CC1F28' : '#2a2a2a',
                border: 'none',
                cursor: 'pointer',
                padding: 0,
                borderRadius: '3px',
                transition: 'all 300ms ease',
              }}
            />
          ))}
        </div>
      </div>
    </section>
  )
}
