'use client'

import { motion } from 'framer-motion'
import { Play } from 'lucide-react'

interface VideoEmbedProps {
  videoUrl: string | null
}

export default function VideoEmbed({ videoUrl }: VideoEmbedProps) {
  return (
    <section style={{ background: '#F4F4F4', padding: 'clamp(24px, 6vw, 80px)' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, margin: '-50px' }}
          transition={{ duration: 0.4 }}>
          <p style={{
            fontSize: '12px',
            fontWeight: 500,
            color: '#C8102E',
            textTransform: 'uppercase',
            letterSpacing: '3px',
            marginBottom: '8px',
          }}>
            How to Use
          </p>
          <h2 className="font-display" style={{ fontSize: '56px', color: '#111111', lineHeight: 1 }}>
            KK-FIX Application Guide
          </h2>
          <div style={{ width: '60px', height: '3px', background: '#C8102E', marginTop: '16px', marginBottom: '40px' }} />
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, margin: '-50px' }}
          transition={{ duration: 0.4, delay: 0.1 }}
          style={{
            position: 'relative',
            aspectRatio: '16/9',
            background: '#111111',
            borderRadius: '8px',
            overflow: 'hidden',
          }}>
          {videoUrl ? (
            <iframe
              src={videoUrl}
              style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', border: 'none' }}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          ) : (
            <div style={{
              position: 'absolute',
              inset: 0,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '16px',
            }}>
              <div style={{
                width: '64px',
                height: '64px',
                borderRadius: '50%',
                border: '2px solid #C8102E',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}>
                <Play size={24} style={{ color: '#C8102E', marginLeft: '3px' }} />
              </div>
              <div style={{ textAlign: 'center' }}>
                <p style={{ fontSize: '14px', fontWeight: 500, color: '#FFFFFF' }}>INSTRUCTIONAL VIDEO</p>
                <p style={{ fontSize: '12px', fontWeight: 300, color: '#888888', marginTop: '4px' }}>Coming Soon</p>
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </section>
  )
}
