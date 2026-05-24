'use client'

import { motion } from 'framer-motion'
import { Play } from 'lucide-react'

interface VideoEmbedProps {
  videoUrl: string | null
}

// Accept watch URLs, short URLs, or already-correct embed URLs
function toEmbedUrl(url: string): string {
  if (url.includes('youtube.com/embed/')) return url
  const watchMatch = url.match(/[?&]v=([^&]+)/)
  if (watchMatch) return `https://www.youtube.com/embed/${watchMatch[1]}`
  const shortMatch = url.match(/youtu\.be\/([^?&]+)/)
  if (shortMatch) return `https://www.youtube.com/embed/${shortMatch[1]}`
  return url
}

export default function VideoEmbed({ videoUrl }: VideoEmbedProps) {
  return (
    <section style={{ background: '#111111', padding: 'clamp(40px, 6vw, 80px)' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-50px' }}
          transition={{ duration: 0.4 }}>
          <p style={{
            fontSize: '11px',
            fontWeight: 500,
            color: '#CC1F28',
            textTransform: 'uppercase',
            letterSpacing: '3px',
            marginBottom: '8px',
          }}>
            How It Works
          </p>
          <h2 className="font-display" style={{ fontSize: 'clamp(40px, 6vw, 56px)', color: '#f0f0f0', lineHeight: 1 }}>
            KK-FIX Application Guide
          </h2>
          <div style={{ width: '48px', height: '3px', background: '#CC1F28', marginTop: '16px', marginBottom: '40px' }} />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 8 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-50px' }}
          transition={{ duration: 0.4, delay: 0.1 }}
          style={{
            position: 'relative',
            aspectRatio: '16/9',
            background: '#0a0a0a',
            border: '1px solid #1e1e1e',
            overflow: 'hidden',
          }}>
          {videoUrl ? (
            <iframe
              src={toEmbedUrl(videoUrl)}
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
                border: '2px solid #CC1F28',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}>
                <Play size={24} style={{ color: '#CC1F28', marginLeft: '3px' }} />
              </div>
              <div style={{ textAlign: 'center' }}>
                <p style={{ fontSize: '13px', fontWeight: 600, color: '#f0f0f0', letterSpacing: '2px', textTransform: 'uppercase' }}>Instructional Video</p>
                <p style={{ fontSize: '12px', color: '#555', marginTop: '4px' }}>Coming Soon</p>
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </section>
  )
}
