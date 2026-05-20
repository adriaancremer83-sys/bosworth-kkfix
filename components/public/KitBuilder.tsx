'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronRight, ChevronLeft, Download, RotateCcw, CheckCircle2 } from 'lucide-react'

// ─── Types ───────────────────────────────────────────────────────────────────

interface Selection {
  damageType: string
  beltWidth: string
  damageArea: number   // cm²
  surface: string[]
}

// ─── Step data ───────────────────────────────────────────────────────────────

const DAMAGE_TYPES = [
  { id: 'cut',          label: 'Cut / Laceration',   icon: '✂️', desc: 'Clean straight or jagged cut through belt' },
  { id: 'abrasion',     label: 'Abrasion / Wear',    icon: '🔄', desc: 'Surface worn down over time' },
  { id: 'puncture',     label: 'Puncture / Hole',    icon: '⚡', desc: 'Impact damage creating a hole' },
  { id: 'delamination', label: 'Delamination',       icon: '📄', desc: 'Layers separating from each other' },
  { id: 'gouge',        label: 'Gouge / Tear',       icon: '⛏️', desc: 'Material removed or torn away' },
  { id: 'edge',         label: 'Edge Damage',        icon: '📐', desc: 'Belt edge fraying or cracking' },
]

const BELT_WIDTHS = [
  '450 mm', '600 mm', '750 mm', '900 mm',
  '1050 mm', '1200 mm', '1350 mm', '1500 mm', '1800 mm+',
]

const SURFACES = [
  { id: 'dry',       label: 'Dry & Clean' },
  { id: 'wet',       label: 'Wet' },
  { id: 'oily',      label: 'Oily / Contaminated' },
  { id: 'rough',     label: 'Rough / Sandy' },
  { id: 'repaired',  label: 'Previously Repaired' },
]

// ─── Recommendation engine ───────────────────────────────────────────────────

interface Recommendation {
  kit: string
  grade: 'Standard' | 'Heavy Duty' | 'Industrial'
  items: string[]
  prepNote: string | null
  applicationTime: string
  notes: string[]
}

function getRecommendation(s: Selection): Recommendation {
  const large    = s.damageArea > 100
  const heavy    = ['gouge', 'delamination', 'puncture'].includes(s.damageType)
  const needPrep = s.surface.some(x => ['wet', 'oily', 'rough'].includes(x))
  const repaired = s.surface.includes('repaired')
  const wideBelt = ['1350 mm', '1500 mm', '1800 mm+'].includes(s.beltWidth)

  const grade: Recommendation['grade'] =
    large || heavy || wideBelt ? 'Heavy Duty' :
    repaired ? 'Industrial' : 'Standard'

  const baseItems = [
    'KK-FIX Compound Part A (Polyether Base)',
    'KK-FIX Hardener Part B',
    'Mixing Spatula',
    'Mixing Stick',
    'Nitrile Gloves (pair)',
  ]

  const extraItems: string[] = []
  if (needPrep || s.surface.includes('oily')) extraItems.push('Surface Solvent / Cleaner')
  if (['cut', 'gouge', 'delamination'].includes(s.damageType)) extraItems.push('Reinforcement Fabric Strip')
  if (large || wideBelt) extraItems.push('Additional Compound Pack (x2)')
  if (repaired) extraItems.push('Surface Abrader / Prep Tool')

  const notes: string[] = []
  if (s.surface.includes('wet'))      notes.push('Surface must be towel-dried before application — KK-FIX does not cure on standing water.')
  if (s.surface.includes('oily'))     notes.push('Degrease thoroughly with solvent; re-apply until swab shows clean.')
  if (repaired)                       notes.push('Scarify the existing repair to a depth of 2mm before applying fresh compound.')
  if (s.damageType === 'delamination') notes.push('Inject compound between layers and clamp for a minimum of 2 hours.')
  if (large)                          notes.push('Apply in two layers for damage areas over 100 cm²; allow 45 min between coats.')

  return {
    kit: 'KK-FIX Conveyor Belt Repair Kit',
    grade,
    items: [...baseItems, ...extraItems],
    prepNote: needPrep ? 'Surface preparation is required before application.' : null,
    applicationTime: large ? '3–4 hours' : heavy ? '2–3 hours' : '1–2 hours',
    notes,
  }
}

// ─── PDF generator ───────────────────────────────────────────────────────────

async function generatePDF(sel: Selection, rec: Recommendation) {
  const { jsPDF } = await import('jspdf')
  const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' })

  const W = 210
  const ORANGE = [232, 101, 10] as [number, number, number]
  const DARK   = [10, 10, 10]  as [number, number, number]
  const GREY   = [138, 154, 176] as [number, number, number]
  const WHITE  = [240, 240, 240] as [number, number, number]

  // Header band
  doc.setFillColor(...DARK)
  doc.rect(0, 0, W, 40, 'F')

  doc.setFillColor(...ORANGE)
  doc.rect(0, 37, W, 3, 'F')

  doc.setFontSize(28)
  doc.setTextColor(...WHITE)
  doc.setFont('helvetica', 'bold')
  doc.text('KK-FIX', 14, 22)

  doc.setFontSize(10)
  doc.setFont('helvetica', 'normal')
  doc.setTextColor(...GREY)
  doc.text('by BOSWORTH', 14, 29)
  doc.text('Kit Builder Report', 14, 35)

  doc.setFontSize(9)
  doc.setTextColor(...GREY)
  doc.text(`Generated: ${new Date().toLocaleDateString('en-ZA', { day: '2-digit', month: 'long', year: 'numeric' })}`, W - 14, 29, { align: 'right' })

  let y = 52

  // Section header helper
  function sectionHeader(title: string) {
    doc.setFillColor(...ORANGE)
    doc.rect(14, y - 4, 4, 10, 'F')
    doc.setFontSize(11)
    doc.setFont('helvetica', 'bold')
    doc.setTextColor(...DARK)
    doc.text(title, 21, y + 2)
    y += 12
  }

  function row(label: string, value: string) {
    doc.setFontSize(9)
    doc.setFont('helvetica', 'bold')
    doc.setTextColor(...GREY)
    doc.text(label.toUpperCase(), 14, y)
    doc.setFont('helvetica', 'normal')
    doc.setTextColor(...DARK)
    doc.text(value, 70, y)
    y += 7
  }

  // Damage Assessment
  sectionHeader('DAMAGE ASSESSMENT')
  const damageLabel = DAMAGE_TYPES.find(d => d.id === sel.damageType)?.label ?? sel.damageType
  row('Damage Type',  damageLabel)
  row('Belt Width',   sel.beltWidth)
  row('Damage Area',  `${sel.damageArea} cm²`)
  row('Surface',      sel.surface.map(s => SURFACES.find(x => x.id === s)?.label ?? s).join(', ') || 'Dry & Clean')
  y += 4

  // Recommendation
  sectionHeader('RECOMMENDED KIT')

  doc.setFontSize(14)
  doc.setFont('helvetica', 'bold')
  doc.setTextColor(...ORANGE)
  doc.text(rec.kit, 14, y)
  y += 7

  doc.setFontSize(10)
  doc.setFont('helvetica', 'bold')
  doc.setTextColor(...DARK)
  doc.text(`Grade: ${rec.grade}`, 14, y)
  doc.text(`Est. Application Time: ${rec.applicationTime}`, 110, y)
  y += 12

  // Kit contents
  doc.setFontSize(9)
  doc.setFont('helvetica', 'bold')
  doc.setTextColor(...GREY)
  doc.text('KIT CONTENTS', 14, y)
  y += 6

  rec.items.forEach(item => {
    doc.setFillColor(...ORANGE)
    doc.circle(16, y - 1.5, 1, 'F')
    doc.setFont('helvetica', 'normal')
    doc.setFontSize(9)
    doc.setTextColor(...DARK)
    doc.text(item, 20, y)
    y += 6
  })
  y += 4

  // Notes
  if (rec.notes.length > 0) {
    sectionHeader('APPLICATION NOTES')
    rec.notes.forEach(note => {
      doc.setFillColor(232, 101, 10)
      doc.setFontSize(8)
      doc.setFont('helvetica', 'bold')
      doc.setTextColor(...ORANGE)
      doc.text('NOTE', 14, y)
      doc.setFont('helvetica', 'normal')
      doc.setTextColor(80, 80, 80)
      const lines = doc.splitTextToSize(note, W - 42)
      doc.text(lines, 28, y)
      y += lines.length * 5 + 5
    })
  }

  // Footer
  doc.setFillColor(...DARK)
  doc.rect(0, 277, W, 20, 'F')
  doc.setFontSize(8)
  doc.setFont('helvetica', 'normal')
  doc.setTextColor(...GREY)
  doc.text('Bosworth (Pty) Ltd  ·  21 Vereeniging Rd, Alrode  ·  pulleys@bosworth.co.za  ·  +27 11 864 1643', W / 2, 287, { align: 'center' })
  doc.text('ISO 9001:2015 · ISO 14001:2015 · ISO 45001:2015 · Member CMA South Africa', W / 2, 292, { align: 'center' })

  doc.save(`KK-FIX-Kit-Assessment-${Date.now()}.pdf`)
}

// ─── Slide animation variants ────────────────────────────────────────────────

function slideVariants(dir: 1 | -1) {
  return {
    enter:  { x: dir * 60, opacity: 0 },
    center: { x: 0,        opacity: 1 },
    exit:   { x: dir * -60, opacity: 0 },
  }
}

// ─── Main component ───────────────────────────────────────────────────────────

export default function KitBuilder() {
  const [step, setStep]       = useState(0)
  const [direction, setDir]   = useState<1 | -1>(1)
  const [done, setDone]       = useState(false)
  const [generating, setGen]  = useState(false)

  const [sel, setSel] = useState<Selection>({
    damageType: '',
    beltWidth:  '',
    damageArea: 50,
    surface:    [],
  })

  const canNext = [
    !!sel.damageType,
    !!sel.beltWidth,
    true,
    sel.surface.length > 0,
  ][step]

  function go(n: 1 | -1) {
    setDir(n)
    const next = step + n
    if (next > 3) { setDone(true); return }
    setStep(next)
  }

  function reset() {
    setSel({ damageType: '', beltWidth: '', damageArea: 50, surface: [] })
    setStep(0); setDir(1); setDone(false)
  }

  function toggleSurface(id: string) {
    setSel(prev => ({
      ...prev,
      surface: prev.surface.includes(id)
        ? prev.surface.filter(x => x !== id)
        : [...prev.surface, id],
    }))
  }

  async function downloadPDF() {
    setGen(true)
    try { await generatePDF(sel, getRecommendation(sel)) }
    finally { setGen(false) }
  }

  const rec = done ? getRecommendation(sel) : null

  const STEP_LABELS = ['Damage Type', 'Belt Width', 'Damage Area', 'Surface Condition']

  return (
    <section id="kit-builder" style={{ background: '#111111', padding: 'clamp(40px, 6vw, 80px)' }}>
      <div style={{ maxWidth: '860px', margin: '0 auto' }}>

        {/* Section header */}
        <motion.div initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.4 }}>
          <p style={{ fontSize: '11px', color: '#E8650A', textTransform: 'uppercase', letterSpacing: '3px', marginBottom: '8px', fontWeight: 500 }}>Tool</p>
          <h2 className="font-display" style={{ fontSize: 'clamp(40px, 6vw, 56px)', color: '#f0f0f0', lineHeight: 1 }}>
            Kit Builder
          </h2>
          <p style={{ fontSize: '15px', color: '#8a9ab0', marginTop: '10px', marginBottom: '40px', lineHeight: 1.6 }}>
            Answer 4 questions. Get the exact kit recommendation for your repair — and a branded PDF to take to site.
          </p>
        </motion.div>

        {/* Card */}
        <div style={{ background: '#0d0d0d', border: '1px solid #1e1e1e', overflow: 'hidden' }}>

          {/* Progress header */}
          {!done && (
            <div style={{ padding: '20px 28px', borderBottom: '1px solid #1a1a1a' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                {STEP_LABELS.map((label, i) => (
                  <div key={label} style={{ display: 'flex', alignItems: 'center', gap: '6px', flex: i < 3 ? 1 : 'none' }}>
                    <div style={{
                      width: '22px', height: '22px', borderRadius: '50%', flexShrink: 0,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: '11px', fontWeight: 700,
                      background: i < step ? '#E8650A' : i === step ? 'rgba(232,101,10,0.2)' : '#1a1a1a',
                      border: `1.5px solid ${i <= step ? '#E8650A' : '#2a2a2a'}`,
                      color: i < step ? '#fff' : i === step ? '#E8650A' : '#444',
                      transition: 'all 250ms',
                    }}>
                      {i < step ? <CheckCircle2 size={12} /> : i + 1}
                    </div>
                    <span style={{ fontSize: '11px', color: i === step ? '#f0f0f0' : '#444', whiteSpace: 'nowrap', display: 'none' }} className="sm:inline">{label}</span>
                    {i < 3 && <div style={{ flex: 1, height: '1px', background: i < step ? '#E8650A' : '#1e1e1e', margin: '0 6px', transition: 'background 250ms' }} />}
                  </div>
                ))}
              </div>
              <div style={{ height: '2px', background: '#1a1a1a' }}>
                <motion.div animate={{ width: `${(step / 3) * 100}%` }} transition={{ duration: 0.3 }}
                  style={{ height: '100%', background: '#E8650A' }} />
              </div>
            </div>
          )}

          {/* Step content */}
          <div style={{ padding: '32px 28px', minHeight: '320px', position: 'relative', overflow: 'hidden' }}>
            <AnimatePresence mode="wait" initial={false}>

              {/* ── Step 0: Damage type ── */}
              {!done && step === 0 && (
                <motion.div key="s0" variants={slideVariants(direction)} initial="enter" animate="center" exit="exit"
                  transition={{ duration: 0.25, ease: 'easeInOut' }}>
                  <p className="font-display" style={{ fontSize: '20px', color: '#f0f0f0', marginBottom: '20px', letterSpacing: '1px' }}>
                    WHAT TYPE OF DAMAGE?
                  </p>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: '10px' }}>
                    {DAMAGE_TYPES.map(d => (
                      <button key={d.id} type="button" onClick={() => setSel(p => ({ ...p, damageType: d.id }))}
                        style={{
                          background: sel.damageType === d.id ? 'rgba(232,101,10,0.12)' : '#111',
                          border: `1.5px solid ${sel.damageType === d.id ? '#E8650A' : '#2a2a2a'}`,
                          padding: '16px', textAlign: 'left', cursor: 'pointer',
                          transition: 'all 150ms',
                        }}
                        onMouseEnter={e => { if (sel.damageType !== d.id) e.currentTarget.style.borderColor = '#444' }}
                        onMouseLeave={e => { if (sel.damageType !== d.id) e.currentTarget.style.borderColor = '#2a2a2a' }}>
                        <div style={{ fontSize: '24px', marginBottom: '8px' }}>{d.icon}</div>
                        <p style={{ fontSize: '13px', fontWeight: 600, color: sel.damageType === d.id ? '#E8650A' : '#f0f0f0', marginBottom: '4px' }}>{d.label}</p>
                        <p style={{ fontSize: '11px', color: '#555', lineHeight: 1.4 }}>{d.desc}</p>
                      </button>
                    ))}
                  </div>
                </motion.div>
              )}

              {/* ── Step 1: Belt width ── */}
              {!done && step === 1 && (
                <motion.div key="s1" variants={slideVariants(direction)} initial="enter" animate="center" exit="exit"
                  transition={{ duration: 0.25, ease: 'easeInOut' }}>
                  <p className="font-display" style={{ fontSize: '20px', color: '#f0f0f0', marginBottom: '20px', letterSpacing: '1px' }}>
                    WHAT IS THE BELT WIDTH?
                  </p>
                  <div style={{ maxWidth: '340px' }}>
                    <select
                      value={sel.beltWidth}
                      onChange={e => setSel(p => ({ ...p, beltWidth: e.target.value }))}
                      style={{
                        width: '100%', background: '#111', border: `1.5px solid ${sel.beltWidth ? '#E8650A' : '#2a2a2a'}`,
                        color: sel.beltWidth ? '#f0f0f0' : '#555', padding: '14px 16px',
                        fontSize: '15px', outline: 'none', cursor: 'pointer', appearance: 'none',
                        backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='8' viewBox='0 0 12 8'%3E%3Cpath d='M1 1l5 5 5-5' stroke='%23E8650A' stroke-width='1.5' fill='none' stroke-linecap='round'/%3E%3C/svg%3E")`,
                        backgroundRepeat: 'no-repeat', backgroundPosition: 'right 14px center',
                      }}>
                      <option value="" disabled>Select belt width…</option>
                      {BELT_WIDTHS.map(w => <option key={w} value={w}>{w}</option>)}
                    </select>
                    <p style={{ fontSize: '12px', color: '#555', marginTop: '10px' }}>
                      Belt width determines compound volume required.
                    </p>
                  </div>
                </motion.div>
              )}

              {/* ── Step 2: Damage area ── */}
              {!done && step === 2 && (
                <motion.div key="s2" variants={slideVariants(direction)} initial="enter" animate="center" exit="exit"
                  transition={{ duration: 0.25, ease: 'easeInOut' }}>
                  <p className="font-display" style={{ fontSize: '20px', color: '#f0f0f0', marginBottom: '20px', letterSpacing: '1px' }}>
                    WHAT IS THE DAMAGE AREA?
                  </p>
                  <div style={{ maxWidth: '480px' }}>
                    <div style={{ display: 'flex', alignItems: 'baseline', gap: '10px', marginBottom: '24px' }}>
                      <span className="font-display" style={{ fontSize: '64px', color: '#E8650A', lineHeight: 1 }}>
                        {sel.damageArea}
                      </span>
                      <span style={{ fontSize: '18px', color: '#8a9ab0' }}>cm²</span>
                    </div>
                    <input
                      type="range"
                      min={5} max={300} step={5}
                      value={sel.damageArea}
                      onChange={e => setSel(p => ({ ...p, damageArea: Number(e.target.value) }))}
                      style={{ width: '100%', accentColor: '#E8650A', height: '4px', cursor: 'pointer' }}
                    />
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: '#444', marginTop: '6px' }}>
                      <span>5 cm²</span><span>150 cm²</span><span>300 cm²</span>
                    </div>
                    <div style={{ marginTop: '20px', display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                      {[
                        { label: 'Small',  val: 20,  desc: '< 20 cm²' },
                        { label: 'Medium', val: 75,  desc: '20–100 cm²' },
                        { label: 'Large',  val: 175, desc: '100–250 cm²' },
                        { label: 'Major',  val: 280, desc: '> 250 cm²' },
                      ].map(preset => (
                        <button key={preset.label} type="button" onClick={() => setSel(p => ({ ...p, damageArea: preset.val }))}
                          style={{
                            background: 'transparent', border: '1px solid #2a2a2a', color: '#8a9ab0',
                            padding: '6px 14px', fontSize: '12px', cursor: 'pointer', transition: 'all 150ms',
                          }}
                          onMouseEnter={e => { e.currentTarget.style.borderColor = '#E8650A'; e.currentTarget.style.color = '#E8650A' }}
                          onMouseLeave={e => { e.currentTarget.style.borderColor = '#2a2a2a'; e.currentTarget.style.color = '#8a9ab0' }}>
                          {preset.label} <span style={{ fontSize: '10px', opacity: 0.6 }}>{preset.desc}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}

              {/* ── Step 3: Surface condition ── */}
              {!done && step === 3 && (
                <motion.div key="s3" variants={slideVariants(direction)} initial="enter" animate="center" exit="exit"
                  transition={{ duration: 0.25, ease: 'easeInOut' }}>
                  <p className="font-display" style={{ fontSize: '20px', color: '#f0f0f0', marginBottom: '6px', letterSpacing: '1px' }}>
                    SURFACE CONDITION?
                  </p>
                  <p style={{ fontSize: '13px', color: '#555', marginBottom: '24px' }}>Select all that apply.</p>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
                    {SURFACES.map(s => {
                      const active = sel.surface.includes(s.id)
                      return (
                        <button key={s.id} type="button" onClick={() => toggleSurface(s.id)}
                          style={{
                            background: active ? 'rgba(232,101,10,0.12)' : 'transparent',
                            border: `1.5px solid ${active ? '#E8650A' : '#2a2a2a'}`,
                            color: active ? '#E8650A' : '#8a9ab0',
                            padding: '10px 20px', fontSize: '14px', cursor: 'pointer',
                            display: 'flex', alignItems: 'center', gap: '8px', transition: 'all 150ms',
                          }}>
                          {active && <CheckCircle2 size={14} />}
                          {s.label}
                        </button>
                      )
                    })}
                  </div>
                </motion.div>
              )}

              {/* ── Result ── */}
              {done && rec && (
                <motion.div key="result" initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3 }}>
                  <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px', marginBottom: '28px' }}>
                    <div>
                      <p style={{ fontSize: '11px', color: '#E8650A', letterSpacing: '3px', textTransform: 'uppercase', marginBottom: '6px' }}>
                        Recommendation
                      </p>
                      <h3 className="font-display" style={{ fontSize: 'clamp(28px, 4vw, 40px)', color: '#f0f0f0', lineHeight: 1, marginBottom: '4px' }}>
                        {rec.kit}
                      </h3>
                      <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', marginTop: '10px' }}>
                        <span style={{ background: 'rgba(232,101,10,0.12)', border: '1px solid rgba(232,101,10,0.3)', color: '#E8650A', padding: '4px 12px', fontSize: '12px', fontWeight: 600, letterSpacing: '1px' }}>
                          {rec.grade.toUpperCase()}
                        </span>
                        <span style={{ background: '#111', border: '1px solid #2a2a2a', color: '#8a9ab0', padding: '4px 12px', fontSize: '12px' }}>
                          Est. {rec.applicationTime}
                        </span>
                      </div>
                    </div>
                    <button onClick={downloadPDF} disabled={generating}
                      style={{
                        background: generating ? '#1a1a1a' : '#E8650A', color: generating ? '#555' : '#fff',
                        border: 'none', padding: '14px 28px', fontSize: '14px', fontWeight: 600,
                        cursor: generating ? 'not-allowed' : 'pointer',
                        display: 'flex', alignItems: 'center', gap: '8px', letterSpacing: '0.5px',
                        transition: 'background 150ms', flexShrink: 0,
                      }}
                      onMouseEnter={e => { if (!generating) e.currentTarget.style.background = '#C4530A' }}
                      onMouseLeave={e => { if (!generating) e.currentTarget.style.background = '#E8650A' }}>
                      <Download size={15} />
                      {generating ? 'Generating…' : 'Download PDF'}
                    </button>
                  </div>

                  {rec.prepNote && (
                    <div style={{ background: 'rgba(245,158,11,0.07)', borderLeft: '3px solid #f59e0b', padding: '12px 16px', marginBottom: '20px', fontSize: '13px', color: '#b45309' }}>
                      ⚠ {rec.prepNote}
                    </div>
                  )}

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                    <div>
                      <p style={{ fontSize: '10px', color: '#555', textTransform: 'uppercase', letterSpacing: '2px', marginBottom: '12px', fontWeight: 700 }}>Kit Contents</p>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                        {rec.items.map((item, i) => (
                          <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '8px', fontSize: '13px', color: '#8a9ab0' }}>
                            <div style={{ width: '6px', height: '6px', background: '#E8650A', borderRadius: '50%', marginTop: '5px', flexShrink: 0 }} />
                            {item}
                          </div>
                        ))}
                      </div>
                    </div>
                    {rec.notes.length > 0 && (
                      <div>
                        <p style={{ fontSize: '10px', color: '#555', textTransform: 'uppercase', letterSpacing: '2px', marginBottom: '12px', fontWeight: 700 }}>Application Notes</p>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                          {rec.notes.map((note, i) => (
                            <p key={i} style={{ fontSize: '12px', color: '#8a9ab0', lineHeight: 1.55, borderLeft: '2px solid #E8650A', paddingLeft: '10px' }}>
                              {note}
                            </p>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </motion.div>
              )}

            </AnimatePresence>
          </div>

          {/* Footer nav */}
          <div style={{
            padding: '16px 28px', borderTop: '1px solid #1a1a1a',
            display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          }}>
            {done ? (
              <>
                <button onClick={reset}
                  style={{ background: 'transparent', border: '1px solid #2a2a2a', color: '#8a9ab0', padding: '10px 20px', fontSize: '13px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px', transition: 'all 150ms' }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor = '#E8650A'; e.currentTarget.style.color = '#E8650A' }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor = '#2a2a2a'; e.currentTarget.style.color = '#8a9ab0' }}>
                  <RotateCcw size={13} /> Start Over
                </button>
                <span style={{ fontSize: '12px', color: '#555' }}>Assessment complete</span>
              </>
            ) : (
              <>
                <button onClick={() => go(-1)} disabled={step === 0}
                  style={{
                    background: 'transparent', border: '1px solid #2a2a2a', color: step === 0 ? '#2a2a2a' : '#8a9ab0',
                    padding: '10px 20px', fontSize: '13px', cursor: step === 0 ? 'default' : 'pointer',
                    display: 'flex', alignItems: 'center', gap: '6px', transition: 'all 150ms',
                  }}
                  onMouseEnter={e => { if (step > 0) { e.currentTarget.style.borderColor = '#555'; e.currentTarget.style.color = '#f0f0f0' } }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor = '#2a2a2a'; e.currentTarget.style.color = step === 0 ? '#2a2a2a' : '#8a9ab0' }}>
                  <ChevronLeft size={14} /> Back
                </button>

                <span style={{ fontSize: '12px', color: '#555' }}>
                  Step {step + 1} of 4
                </span>

                <motion.button
                  onClick={() => canNext && go(1)}
                  whileTap={canNext ? { scale: 0.97 } : {}}
                  style={{
                    background: canNext ? '#E8650A' : '#1a1a1a',
                    border: 'none', color: canNext ? '#fff' : '#333',
                    padding: '10px 24px', fontSize: '13px', fontWeight: 600,
                    cursor: canNext ? 'pointer' : 'not-allowed',
                    display: 'flex', alignItems: 'center', gap: '6px',
                    transition: 'background 150ms',
                  }}
                  onMouseEnter={e => { if (canNext) e.currentTarget.style.background = '#C4530A' }}
                  onMouseLeave={e => { if (canNext) e.currentTarget.style.background = '#E8650A' }}>
                  {step === 3 ? 'Get Recommendation' : 'Next'} <ChevronRight size={14} />
                </motion.button>
              </>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
