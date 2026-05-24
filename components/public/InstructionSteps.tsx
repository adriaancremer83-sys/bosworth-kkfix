'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { AlertTriangle, CheckCircle2, ChevronDown, Clock } from 'lucide-react'
import type { Instruction } from '@/lib/types'

interface InstructionStepsProps {
  instructions: Instruction[]
}

export default function InstructionSteps({ instructions }: InstructionStepsProps) {
  const [expanded, setExpanded] = useState<string | null>(instructions[0]?.id ?? null)
  const [completed, setCompleted] = useState<Set<string>>(new Set())

  function toggle(id: string) {
    setExpanded(prev => prev === id ? null : id)
  }

  function markComplete(e: React.MouseEvent, id: string) {
    e.stopPropagation()
    setCompleted(prev => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  const completedCount = completed.size
  const totalCount = instructions.length
  const progressPct = totalCount > 0 ? (completedCount / totalCount) * 100 : 0

  return (
    <section id="instructions" style={{ background: '#0a0a0a', padding: 'clamp(40px, 6vw, 80px)' }}>
      <div style={{ maxWidth: '900px', margin: '0 auto' }}>
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-50px' }}
          transition={{ duration: 0.4 }}>
          <p style={{ fontSize: '11px', fontWeight: 500, color: '#CC1F28', textTransform: 'uppercase', letterSpacing: '3px', marginBottom: '8px' }}>
            Instructions
          </p>
          <h2 className="font-display" style={{ fontSize: 'clamp(40px, 6vw, 56px)', color: '#f0f0f0', lineHeight: 1 }}>
            Step-by-Step Guide
          </h2>
          <div style={{ width: '48px', height: '3px', background: '#CC1F28', margin: '16px 0 32px 0' }} />
        </motion.div>

        {/* Progress bar */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          style={{ marginBottom: '40px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
            <span style={{ fontSize: '12px', color: '#8a9ab0', fontWeight: 500 }}>
              {completedCount} of {totalCount} steps complete
            </span>
            {completedCount === totalCount && totalCount > 0 && (
              <span style={{ fontSize: '12px', color: '#22c55e', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '4px' }}>
                <CheckCircle2 size={14} /> All done!
              </span>
            )}
          </div>
          <div style={{ height: '4px', background: '#1a1a1a', borderRadius: '2px', overflow: 'hidden' }}>
            <motion.div
              animate={{ width: `${progressPct}%` }}
              transition={{ duration: 0.4, ease: 'easeOut' }}
              style={{ height: '100%', background: '#CC1F28', borderRadius: '2px' }}
            />
          </div>
        </motion.div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {instructions.map((step, i) => {
            const isOpen = expanded === step.id
            const isDone = completed.has(step.id)
            return (
              <motion.div
                key={step.id}
                initial={{ opacity: 0, x: -16 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: '-50px' }}
                transition={{ duration: 0.4, delay: i * 0.06 }}
                style={{
                  background: '#111111',
                  border: `1px solid ${isOpen ? '#CC1F28' : '#1e1e1e'}`,
                  borderLeft: `3px solid ${isDone ? '#22c55e' : '#CC1F28'}`,
                  transition: 'border-color 200ms',
                  overflow: 'hidden',
                }}>
                {/* Header row */}
                <button
                  onClick={() => toggle(step.id)}
                  style={{
                    width: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '16px',
                    padding: '20px 24px',
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    textAlign: 'left',
                  }}>
                  <span
                    className="font-display"
                    style={{
                      fontSize: '32px',
                      color: isDone ? '#22c55e' : '#CC1F28',
                      lineHeight: 1,
                      minWidth: '52px',
                      transition: 'color 200ms',
                    }}>
                    {String(step.step_number).padStart(2, '0')}
                  </span>
                  <div style={{ flex: 1 }}>
                    <h3
                      className="font-display"
                      style={{
                        fontSize: '22px',
                        color: isDone ? '#555' : '#f0f0f0',
                        lineHeight: 1,
                        textDecoration: isDone ? 'line-through' : 'none',
                        transition: 'color 200ms',
                      }}>
                      {step.title}
                    </h3>
                    {step.estimated_time && (
                      <span style={{ fontSize: '11px', color: '#555', display: 'flex', alignItems: 'center', gap: '4px', marginTop: '4px' }}>
                        <Clock size={11} /> {step.estimated_time}
                      </span>
                    )}
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexShrink: 0 }}>
                    <motion.button
                      onClick={e => markComplete(e, step.id)}
                      whileTap={{ scale: 0.92 }}
                      style={{
                        background: isDone ? '#22c55e' : 'transparent',
                        border: `1px solid ${isDone ? '#22c55e' : '#333'}`,
                        color: isDone ? '#fff' : '#555',
                        padding: '6px 14px',
                        fontSize: '11px',
                        fontWeight: 600,
                        letterSpacing: '1px',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '5px',
                        transition: 'background 200ms, border-color 200ms, color 200ms',
                        whiteSpace: 'nowrap',
                      }}>
                      {isDone ? <><CheckCircle2 size={12} /> DONE</> : 'MARK DONE'}
                    </motion.button>
                    <motion.div
                      animate={{ rotate: isOpen ? 180 : 0 }}
                      transition={{ duration: 0.2 }}>
                      <ChevronDown size={18} style={{ color: '#555' }} />
                    </motion.div>
                  </div>
                </button>

                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      key="content"
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.25, ease: 'easeInOut' }}
                      style={{ overflow: 'hidden' }}>
                      <div style={{ padding: '0 24px 28px 92px', display: 'flex', gap: '32px', flexWrap: 'wrap', alignItems: 'flex-start' }}>
                        <div style={{ flex: '1 1 280px' }}>
                          <p style={{ fontSize: '15px', color: '#8a9ab0', lineHeight: 1.75 }}>
                            {step.description}
                          </p>
                          {step.warning && (
                            <div style={{
                              marginTop: '16px',
                              background: 'rgba(245,158,11,0.08)',
                              borderLeft: '3px solid #f59e0b',
                              padding: '12px 16px',
                              display: 'flex',
                              gap: '10px',
                              alignItems: 'flex-start',
                            }}>
                              <AlertTriangle size={15} style={{ color: '#f59e0b', flexShrink: 0, marginTop: '2px' }} />
                              <p style={{ fontSize: '13px', color: '#b45309', lineHeight: 1.5 }}>
                                {step.warning}
                              </p>
                            </div>
                          )}
                        </div>
                        {step.image_url && (
                          <div style={{ flex: '0 0 auto', width: '220px' }}>
                            <img
                              src={step.image_url}
                              alt={`Step ${step.step_number}`}
                              style={{
                                width: '100%',
                                borderRadius: '4px',
                                display: 'block',
                                objectFit: 'cover',
                                border: '1px solid #2a2a2a',
                              }}
                            />
                          </div>
                        )}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
