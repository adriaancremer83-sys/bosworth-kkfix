'use client'

import { motion } from 'framer-motion'
import { AlertTriangle } from 'lucide-react'
import type { Instruction } from '@/lib/types'

interface InstructionStepsProps {
  instructions: Instruction[]
}

export default function InstructionSteps({ instructions }: InstructionStepsProps) {
  return (
    <section style={{ background: '#F4F4F4', padding: '80px' }}>
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
            Instructions
          </p>
          <h2 className="font-display" style={{ fontSize: '56px', color: '#111111', lineHeight: 1 }}>
            Step-by-Step Instructions
          </h2>
          <div style={{ width: '60px', height: '3px', background: '#C8102E', margin: '16px 0 40px 0' }} />
        </motion.div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {instructions.map((step, i) => (
            <motion.div
              key={step.id}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ duration: 0.4, delay: i * 0.1 }}
              style={{
                background: '#FFFFFF',
                borderRadius: '4px',
                borderLeft: '4px solid #C8102E',
                padding: '40px 48px',
                position: 'relative',
                overflow: 'hidden',
                boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
              }}>
              <span
                className="font-display"
                style={{
                  position: 'absolute',
                  right: '-10px',
                  top: '-20px',
                  fontSize: '200px',
                  color: '#F4F4F4',
                  lineHeight: 1,
                  userSelect: 'none',
                  pointerEvents: 'none',
                  zIndex: 0,
                }}>
                {String(step.step_number).padStart(2, '0')}
              </span>

              <div style={{ position: 'relative', zIndex: 1 }}>
                <p style={{
                  fontSize: '11px',
                  fontWeight: 700,
                  color: '#C8102E',
                  textTransform: 'uppercase',
                  letterSpacing: '3px',
                }}>
                  Step {String(step.step_number).padStart(2, '0')}
                </p>
                <h3 className="font-display" style={{ fontSize: '42px', color: '#111111', marginTop: '4px', lineHeight: 1 }}>
                  {step.title}
                </h3>
                <p style={{
                  fontSize: '16px',
                  fontWeight: 400,
                  color: '#444444',
                  lineHeight: 1.75,
                  marginTop: '16px',
                  maxWidth: '680px',
                }}>
                  {step.description}
                </p>

                {step.warning && (
                  <div style={{
                    marginTop: '20px',
                    background: '#FFFBEB',
                    borderLeft: '3px solid #D97706',
                    padding: '12px 16px',
                    borderRadius: '0 4px 4px 0',
                    display: 'flex',
                    gap: '10px',
                    alignItems: 'flex-start',
                  }}>
                    <AlertTriangle size={16} style={{ color: '#D97706', flexShrink: 0, marginTop: '2px' }} />
                    <p style={{ fontSize: '14px', fontWeight: 400, color: '#92400E', lineHeight: 1.5 }}>
                      {step.warning}
                    </p>
                  </div>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
