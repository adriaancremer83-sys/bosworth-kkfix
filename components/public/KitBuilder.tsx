'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronRight, ChevronLeft, Download, RotateCcw, CheckCircle2, MessageCircle, Mail } from 'lucide-react'

// ─── Types ───────────────────────────────────────────────────────────────────

interface Selection {
  damageType:  string
  beltWidth:   string
  damageArea:  number
  lengthMm:    string
  widthMm:     string
  areaUnknown: boolean
  surface:     string[]
}

// ─── Step data ───────────────────────────────────────────────────────────────

const DAMAGE_TYPES = [
  { id: 'cut',          label: 'Cut / Laceration',   desc: 'Clean straight or jagged cut through belt' },
  { id: 'abrasion',     label: 'Abrasion / Wear',    desc: 'Surface worn down over time' },
  { id: 'puncture',     label: 'Puncture / Hole',    desc: 'Impact damage creating a hole' },
  { id: 'delamination', label: 'Delamination',       desc: 'Layers separating from each other' },
  { id: 'gouge',        label: 'Gouge / Tear',       desc: 'Material removed or torn away' },
  { id: 'edge',         label: 'Edge Damage',        desc: 'Belt edge fraying or cracking' },
]

const BELT_WIDTHS = [
  '450 mm', '600 mm', '750 mm', '900 mm',
  '1050 mm', '1200 mm', '1350 mm', '1500 mm', '1800 mm+',
]

const SURFACES = [
  { id: 'dry',      label: 'Dry & Clean' },
  { id: 'wet',      label: 'Wet' },
  { id: 'oily',     label: 'Oily / Contaminated' },
  { id: 'rough',    label: 'Rough / Sandy' },
  { id: 'repaired', label: 'Previously Repaired' },
]

// ─── Area format helper ───────────────────────────────────────────────────────

function fmtArea(s: Selection): string {
  if (s.areaUnknown) return 'Not measured (medium estimate used)'
  return `${s.lengthMm} × ${s.widthMm} mm (${s.damageArea} cm²)`
}

// ─── Bag quantity calculator ──────────────────────────────────────────────────

function getRecommendedBags(s: Selection): string {
  const isDelamination = s.damageType === 'delamination'
  const multiSurface   = s.surface.length >= 3
  const large          = s.damageArea >= 300

  if ((large || isDelamination) && multiSurface) return '4+'
  if (large || isDelamination)                   return '3'
  if (s.damageArea >= 100)                       return '2'
  return '1'
}

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
  if (s.surface.includes('wet'))       notes.push('Surface must be towel-dried before application — KK-FIX does not cure on standing water.')
  if (s.surface.includes('oily'))      notes.push('Degrease thoroughly with solvent; re-apply until swab shows clean.')
  if (repaired)                        notes.push('Scarify the existing repair to a depth of 2mm before applying fresh compound.')
  if (s.damageType === 'delamination') notes.push('Inject compound between layers and clamp for a minimum of 2 hours.')
  if (large)                           notes.push('Apply in two layers for damage areas over 100 cm²; allow 45 min between coats.')

  return {
    kit: 'KK-FIX Conveyor Belt Repair Kit',
    grade,
    items: [...baseItems, ...extraItems],
    prepNote: needPrep ? 'Surface preparation is required before application.' : null,
    applicationTime: large ? '3–4 hours' : heavy ? '2–3 hours' : '1–2 hours',
    notes,
  }
}

// ─── Order link builders ──────────────────────────────────────────────────────

function buildWhatsAppUrl(sel: Selection, rec: Recommendation, bags: string): string {
  const damage   = DAMAGE_TYPES.find(d => d.id === sel.damageType)?.label ?? sel.damageType
  const surfaces = sel.surface.map(s => SURFACES.find(x => x.id === s)?.label ?? s).join(', ') || 'Dry & Clean'
  const msg =
    `Hi Bosworth,\n\n` +
    `I'd like to order KK-Fix based on a Kit Builder assessment:\n\n` +
    `*Kit:* ${rec.kit}\n` +
    `*Grade:* ${rec.grade}\n` +
    `*Recommended Quantity:* ${bags} bag(s)\n\n` +
    `*Damage Type:* ${damage}\n` +
    `*Belt Width:* ${sel.beltWidth}\n` +
    `*Damage Area:* ${fmtArea(sel)}\n` +
    `*Surface:* ${surfaces}\n\n` +
    `Please assist with the order.`
  return `https://wa.me/27733701457?text=${encodeURIComponent(msg)}`
}

function buildEmailUrl(sel: Selection, rec: Recommendation, bags: string): string {
  const damage   = DAMAGE_TYPES.find(d => d.id === sel.damageType)?.label ?? sel.damageType
  const surfaces = sel.surface.map(s => SURFACES.find(x => x.id === s)?.label ?? s).join(', ') || 'Dry & Clean'
  const body =
    `Hi Bosworth,\n\n` +
    `I would like to place an order for KK-Fix based on the following Kit Builder assessment:\n\n` +
    `Kit: ${rec.kit}\n` +
    `Grade: ${rec.grade}\n` +
    `Recommended Quantity: ${bags} bag(s)\n\n` +
    `Assessment Details:\n` +
    `- Damage Type: ${damage}\n` +
    `- Belt Width: ${sel.beltWidth}\n` +
    `- Damage Area: ${fmtArea(sel)}\n` +
    `- Surface Condition: ${surfaces}\n\n` +
    `Recommended Kit Contents:\n` +
    rec.items.map(item => `- ${item}`).join('\n') +
    `\n\nPlease get in touch to process this order.\n\nKind regards`
  return `mailto:pulleys@bosworth.co.za?subject=${encodeURIComponent('KK-Fix Order Request')}&body=${encodeURIComponent(body)}`
}

// ─── PDF generator ───────────────────────────────────────────────────────────

async function generatePDF(sel: Selection, rec: Recommendation) {
  const { jsPDF } = await import('jspdf')
  const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' })

  const W      = 210
  const ORANGE = [232, 101, 10]  as [number, number, number]
  const DARK   = [10,  10,  10]  as [number, number, number]
  const GREY   = [138, 154, 176] as [number, number, number]
  const WHITE  = [240, 240, 240] as [number, number, number]

  doc.setFillColor(...DARK)
  doc.rect(0, 0, W, 40, 'F')
  doc.setFillColor(...ORANGE)
  doc.rect(0, 37, W, 3, 'F')

  doc.setFontSize(28); doc.setTextColor(...WHITE); doc.setFont('helvetica', 'bold')
  doc.text('KK-FIX', 14, 22)
  doc.setFontSize(10); doc.setFont('helvetica', 'normal'); doc.setTextColor(...GREY)
  doc.text('by BOSWORTH', 14, 29)
  doc.text('Kit Builder Report', 14, 35)
  doc.setFontSize(9)
  doc.text(`Generated: ${new Date().toLocaleDateString('en-ZA', { day: '2-digit', month: 'long', year: 'numeric' })}`, W - 14, 29, { align: 'right' })

  let y = 52

  function sectionHeader(title: string) {
    doc.setFillColor(...ORANGE)
    doc.rect(14, y - 4, 4, 10, 'F')
    doc.setFontSize(11); doc.setFont('helvetica', 'bold'); doc.setTextColor(...DARK)
    doc.text(title, 21, y + 2)
    y += 12
  }

  function row(label: string, value: string) {
    doc.setFontSize(9); doc.setFont('helvetica', 'bold'); doc.setTextColor(...GREY)
    doc.text(label.toUpperCase(), 14, y)
    doc.setFont('helvetica', 'normal'); doc.setTextColor(...DARK)
    doc.text(value, 70, y)
    y += 7
  }

  sectionHeader('DAMAGE ASSESSMENT')
  const damageLabel = DAMAGE_TYPES.find(d => d.id === sel.damageType)?.label ?? sel.damageType
  row('Damage Type', damageLabel)
  row('Belt Width',  sel.beltWidth)
  row('Damage Area', fmtArea(sel))
  row('Surface',     sel.surface.map(s => SURFACES.find(x => x.id === s)?.label ?? s).join(', ') || 'Dry & Clean')
  row('Recommended Qty', `${getRecommendedBags(sel)} bag(s)`)
  y += 4

  sectionHeader('RECOMMENDED KIT')
  doc.setFontSize(14); doc.setFont('helvetica', 'bold'); doc.setTextColor(...ORANGE)
  doc.text(rec.kit, 14, y); y += 7
  doc.setFontSize(10); doc.setFont('helvetica', 'bold'); doc.setTextColor(...DARK)
  doc.text(`Grade: ${rec.grade}`, 14, y)
  doc.text(`Est. Application Time: ${rec.applicationTime}`, 110, y)
  y += 12

  doc.setFontSize(9); doc.setFont('helvetica', 'bold'); doc.setTextColor(...GREY)
  doc.text('KIT CONTENTS', 14, y); y += 6
  rec.items.forEach(item => {
    doc.setFillColor(...ORANGE); doc.circle(16, y - 1.5, 1, 'F')
    doc.setFont('helvetica', 'normal'); doc.setFontSize(9); doc.setTextColor(...DARK)
    doc.text(item, 20, y); y += 6
  })
  y += 4

  if (rec.notes.length > 0) {
    sectionHeader('APPLICATION NOTES')
    rec.notes.forEach(note => {
      doc.setFontSize(8); doc.setFont('helvetica', 'bold'); doc.setTextColor(...ORANGE)
      doc.text('NOTE', 14, y)
      doc.setFont('helvetica', 'normal'); doc.setTextColor(80, 80, 80)
      const lines = doc.splitTextToSize(note, W - 42)
      doc.text(lines, 28, y)
      y += lines.length * 5 + 5
    })
  }

  doc.setFillColor(...DARK); doc.rect(0, 277, W, 20, 'F')
  doc.setFontSize(8); doc.setFont('helvetica', 'normal'); doc.setTextColor(...GREY)
  doc.text('Bosworth (Pty) Ltd  ·  21 Vereeniging Rd, Alrode  ·  pulleys@bosworth.co.za  ·  +27 11 864 1643', W / 2, 287, { align: 'center' })
  doc.text('ISO 9001:2015 · ISO 14001:2015 · ISO 45001:2015 · Member CMA South Africa', W / 2, 292, { align: 'center' })

  doc.save(`KK-FIX-Kit-Assessment-${Date.now()}.pdf`)
}

// ─── Slide animation variants ─────────────────────────────────────────────────

function slideVariants(dir: 1 | -1) {
  return {
    enter:  { x: dir * 60,  opacity: 0 },
    center: { x: 0,         opacity: 1 },
    exit:   { x: dir * -60, opacity: 0 },
  }
}

// ─── Shared card style helpers ────────────────────────────────────────────────

function answerCardStyle(selected: boolean): React.CSSProperties {
  return {
    background:  selected ? 'rgba(232,101,10,0.10)' : '#111111',
    border:      `1.5px solid ${selected ? '#CC1F28' : '#2a2a2a'}`,
    padding:     '18px',
    textAlign:   'left',
    cursor:      'pointer',
    transition:  'border-color 150ms, background 150ms',
    position:    'relative',
  }
}

// ─── Main component ───────────────────────────────────────────────────────────

const TOTAL_STEPS = 4
const STEP_LABELS = ['Damage Type', 'Belt Width', 'Damage Area', 'Surface']

export default function KitBuilder() {
  const [step, setStep]      = useState(0)
  const [direction, setDir]  = useState<1 | -1>(1)
  const [done, setDone]      = useState(false)
  const [generating, setGen] = useState(false)

  const [sel, setSel] = useState<Selection>({
    damageType:  '',
    beltWidth:   '',
    damageArea:  0,
    lengthMm:    '',
    widthMm:     '',
    areaUnknown: false,
    surface:     [],
  })

  const canNext = [
    !!sel.damageType,
    !!sel.beltWidth,
    sel.areaUnknown || sel.damageArea > 0,
    sel.surface.length > 0,
  ][step]

  function go(n: 1 | -1) {
    setDir(n)
    const next = step + n
    if (next >= TOTAL_STEPS) { setDone(true); return }
    setStep(next)
  }

  function reset() {
    setSel({ damageType: '', beltWidth: '', damageArea: 0, lengthMm: '', widthMm: '', areaUnknown: false, surface: [] })
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

  return (
    <section id="kit-builder" style={{ background: '#111111', padding: 'clamp(40px, 6vw, 80px)' }}>
      <div style={{ maxWidth: '860px', margin: '0 auto' }}>

        {/* Section header */}
        <motion.div initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.4 }}>
          <p style={{ fontSize: '11px', color: '#CC1F28', textTransform: 'uppercase', letterSpacing: '3px', marginBottom: '8px', fontWeight: 500 }}>Tool</p>
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
                  <div key={label} style={{ display: 'flex', alignItems: 'center', gap: '6px', flex: i < TOTAL_STEPS - 1 ? 1 : 'none' }}>
                    <div style={{
                      width: '22px', height: '22px', borderRadius: '50%', flexShrink: 0,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: '11px', fontWeight: 700,
                      background: i < step ? '#CC1F28' : i === step ? 'rgba(232,101,10,0.2)' : '#1a1a1a',
                      border: `1.5px solid ${i <= step ? '#CC1F28' : '#2a2a2a'}`,
                      color: i < step ? '#fff' : i === step ? '#CC1F28' : '#444',
                      transition: 'all 250ms',
                    }}>
                      {i < step ? <CheckCircle2 size={12} /> : i + 1}
                    </div>
                    <span style={{ fontSize: '11px', color: i === step ? '#f0f0f0' : '#444', whiteSpace: 'nowrap', display: 'none' }} className="sm:inline">{label}</span>
                    {i < TOTAL_STEPS - 1 && (
                      <div style={{ flex: 1, height: '1px', background: i < step ? '#CC1F28' : '#1e1e1e', margin: '0 6px', transition: 'background 250ms' }} />
                    )}
                  </div>
                ))}
              </div>
              <div style={{ height: '2px', background: '#1a1a1a' }}>
                <motion.div
                  animate={{ width: `${(step / (TOTAL_STEPS - 1)) * 100}%` }}
                  transition={{ duration: 0.3 }}
                  style={{ height: '100%', background: '#CC1F28' }}
                />
              </div>
            </div>
          )}

          {/* Step content */}
          <div style={{ padding: '32px 28px', minHeight: '320px', position: 'relative', overflow: 'hidden' }}>
            <AnimatePresence mode="wait" initial={false}>

              {/* ── Step 0: Damage type ── */}
              {!done && step === 0 && (
                <motion.div key="s0" variants={slideVariants(direction)} initial="enter" animate="center" exit="exit" transition={{ duration: 0.25, ease: 'easeInOut' }}>
                  <p className="font-display" style={{ fontSize: '20px', color: '#f0f0f0', marginBottom: '20px', letterSpacing: '1px' }}>
                    WHAT TYPE OF DAMAGE?
                  </p>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: '10px' }}>
                    {DAMAGE_TYPES.map(d => {
                      const selected = sel.damageType === d.id
                      return (
                        <button key={d.id} type="button" onClick={() => setSel(p => ({ ...p, damageType: d.id }))}
                          style={answerCardStyle(selected)}
                          onMouseEnter={e => { if (!selected) e.currentTarget.style.borderColor = '#444' }}
                          onMouseLeave={e => { if (!selected) e.currentTarget.style.borderColor = '#2a2a2a' }}>
                          {selected && (
                            <CheckCircle2 size={14} style={{ color: '#CC1F28', position: 'absolute', top: '12px', right: '12px' }} />
                          )}
                          <p style={{ fontSize: '14px', fontWeight: 600, color: selected ? '#CC1F28' : '#f0f0f0', marginBottom: '6px', paddingRight: '20px' }}>
                            {d.label}
                          </p>
                          <p style={{ fontSize: '11px', color: '#555', lineHeight: 1.4 }}>{d.desc}</p>
                        </button>
                      )
                    })}
                  </div>
                </motion.div>
              )}

              {/* ── Step 1: Belt width ── */}
              {!done && step === 1 && (
                <motion.div key="s1" variants={slideVariants(direction)} initial="enter" animate="center" exit="exit" transition={{ duration: 0.25, ease: 'easeInOut' }}>
                  <p className="font-display" style={{ fontSize: '20px', color: '#f0f0f0', marginBottom: '20px', letterSpacing: '1px' }}>
                    WHAT IS THE BELT WIDTH?
                  </p>
                  <div style={{ maxWidth: '340px' }}>
                    <select
                      value={sel.beltWidth}
                      onChange={e => setSel(p => ({ ...p, beltWidth: e.target.value }))}
                      style={{
                        width: '100%', background: '#111', border: `1.5px solid ${sel.beltWidth ? '#CC1F28' : '#2a2a2a'}`,
                        color: sel.beltWidth ? '#f0f0f0' : '#555', padding: '14px 16px',
                        fontSize: '15px', outline: 'none', cursor: 'pointer', appearance: 'none',
                        backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='8' viewBox='0 0 12 8'%3E%3Cpath d='M1 1l5 5 5-5' stroke='%23CC1F28' stroke-width='1.5' fill='none' stroke-linecap='round'/%3E%3C/svg%3E")`,
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
                <motion.div key="s2" variants={slideVariants(direction)} initial="enter" animate="center" exit="exit" transition={{ duration: 0.25, ease: 'easeInOut' }}>
                  <p className="font-display" style={{ fontSize: '20px', color: '#f0f0f0', marginBottom: '6px', letterSpacing: '1px' }}>
                    WHAT IS THE DAMAGE SIZE?
                  </p>
                  <p style={{ fontSize: '13px', color: '#555', marginBottom: '24px' }}>Measure the damaged area on the belt surface.</p>
                  <div style={{ maxWidth: '420px' }}>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
                      {([
                        { key: 'lengthMm' as const, label: 'Length (mm)', placeholder: 'e.g. 150' },
                        { key: 'widthMm'  as const, label: 'Width (mm)',  placeholder: 'e.g. 80'  },
                      ]).map(({ key, label, placeholder }) => (
                        <div key={key}>
                          <label style={{ fontSize: '11px', color: '#555', textTransform: 'uppercase', letterSpacing: '2px', display: 'block', marginBottom: '8px', fontWeight: 600 }}>
                            {label}
                          </label>
                          <input
                            type="number"
                            min={1}
                            placeholder={placeholder}
                            value={sel[key]}
                            onChange={e => {
                              const val = e.target.value
                              setSel(p => {
                                const l = key === 'lengthMm' ? val : p.lengthMm
                                const w = key === 'widthMm'  ? val : p.widthMm
                                const fl = parseFloat(l), fw = parseFloat(w)
                                const area = (fl > 0 && fw > 0) ? Math.round(fl * fw / 100) : 0
                                return { ...p, [key]: val, areaUnknown: false, damageArea: area }
                              })
                            }}
                            style={{
                              width: '100%', background: '#111', boxSizing: 'border-box',
                              border: `1.5px solid ${sel[key] && !sel.areaUnknown ? '#CC1F28' : '#2a2a2a'}`,
                              color: '#f0f0f0', padding: '14px 16px', fontSize: '15px', outline: 'none',
                            }}
                          />
                        </div>
                      ))}
                    </div>

                    {/* Live area display */}
                    {sel.damageArea > 0 && !sel.areaUnknown && (
                      <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px', marginBottom: '16px', padding: '12px 16px', background: 'rgba(204,31,40,0.07)', border: '1px solid rgba(204,31,40,0.2)' }}>
                        <span style={{ fontSize: '13px', color: '#8a9ab0' }}>Area:</span>
                        <span className="font-display" style={{ fontSize: '28px', color: '#CC1F28', lineHeight: 1 }}>{sel.damageArea}</span>
                        <span style={{ fontSize: '14px', color: '#8a9ab0' }}>cm²</span>
                      </div>
                    )}

                    {/* Not sure option */}
                    <button
                      type="button"
                      onClick={() => setSel(p => ({ ...p, areaUnknown: true, lengthMm: '', widthMm: '', damageArea: 150 }))}
                      style={{
                        width: '100%', background: sel.areaUnknown ? 'rgba(204,31,40,0.10)' : 'transparent',
                        border: `1.5px solid ${sel.areaUnknown ? '#CC1F28' : '#2a2a2a'}`,
                        color: sel.areaUnknown ? '#CC1F28' : '#8a9ab0',
                        padding: '10px 20px', fontSize: '13px', cursor: 'pointer',
                        display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', transition: 'all 150ms',
                      }}
                      onMouseEnter={e => { if (!sel.areaUnknown) { e.currentTarget.style.borderColor = '#555'; e.currentTarget.style.color = '#f0f0f0' } }}
                      onMouseLeave={e => { if (!sel.areaUnknown) { e.currentTarget.style.borderColor = '#2a2a2a'; e.currentTarget.style.color = '#8a9ab0' } }}
                    >
                      {sel.areaUnknown && <CheckCircle2 size={14} />}
                      Not sure — I&apos;ll estimate
                    </button>
                    {sel.areaUnknown && (
                      <p style={{ fontSize: '11px', color: '#555', marginTop: '8px', textAlign: 'center' }}>
                        A medium damage estimate will be used for recommendations.
                      </p>
                    )}
                  </div>
                </motion.div>
              )}

              {/* ── Step 3: Surface condition ── */}
              {!done && step === 3 && (
                <motion.div key="s3" variants={slideVariants(direction)} initial="enter" animate="center" exit="exit" transition={{ duration: 0.25, ease: 'easeInOut' }}>
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
                            border: `1.5px solid ${active ? '#CC1F28' : '#2a2a2a'}`,
                            color: active ? '#CC1F28' : '#8a9ab0',
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
              {done && rec && (() => {
                const bags = getRecommendedBags(sel)
                return (
                <motion.div key="result" initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.3 }}>

                  {/* Top row: title + PDF */}
                  <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px', marginBottom: '20px' }}>
                    <div>
                      <p style={{ fontSize: '11px', color: '#CC1F28', letterSpacing: '3px', textTransform: 'uppercase', marginBottom: '6px' }}>Recommendation</p>
                      <h3 className="font-display" style={{ fontSize: 'clamp(28px, 4vw, 40px)', color: '#f0f0f0', lineHeight: 1, marginBottom: '4px' }}>
                        {rec.kit}
                      </h3>
                      <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', marginTop: '10px' }}>
                        <span style={{ background: 'rgba(232,101,10,0.12)', border: '1px solid rgba(232,101,10,0.3)', color: '#CC1F28', padding: '4px 12px', fontSize: '12px', fontWeight: 600, letterSpacing: '1px' }}>
                          {rec.grade.toUpperCase()}
                        </span>
                        <span style={{ background: '#111', border: '1px solid #2a2a2a', color: '#8a9ab0', padding: '4px 12px', fontSize: '12px' }}>
                          Est. {rec.applicationTime}
                        </span>
                      </div>
                    </div>
                    <button onClick={downloadPDF} disabled={generating}
                      style={{
                        background: generating ? '#1a1a1a' : '#CC1F28', color: generating ? '#555' : '#fff',
                        border: 'none', padding: '12px 24px', fontSize: '13px', fontWeight: 600,
                        cursor: generating ? 'not-allowed' : 'pointer',
                        display: 'flex', alignItems: 'center', gap: '8px',
                        transition: 'background 150ms', flexShrink: 0,
                      }}
                      onMouseEnter={e => { if (!generating) e.currentTarget.style.background = '#C4530A' }}
                      onMouseLeave={e => { if (!generating) e.currentTarget.style.background = generating ? '#1a1a1a' : '#CC1F28' }}>
                      <Download size={14} />
                      {generating ? 'Generating…' : 'Download PDF'}
                    </button>
                  </div>

                  {/* Recommended quantity */}
                  <div style={{ marginBottom: '20px', padding: '16px 20px', background: 'rgba(232,101,10,0.07)', border: '1.5px solid rgba(232,101,10,0.25)' }}>
                    <p style={{ fontSize: '11px', color: '#CC1F28', textTransform: 'uppercase', letterSpacing: '2px', fontWeight: 700, marginBottom: '4px' }}>Recommended Quantity</p>
                    <p className="font-display" style={{ fontSize: '36px', color: '#CC1F28', lineHeight: 1 }}>
                      {bags} <span style={{ fontSize: '18px', color: '#CC1F28', opacity: 0.7 }}>bag{bags === '1' ? '' : 's'}</span>
                    </p>
                  </div>

                  {rec.prepNote && (
                    <div style={{ background: 'rgba(245,158,11,0.07)', borderLeft: '3px solid #f59e0b', padding: '12px 16px', marginBottom: '20px', fontSize: '13px', color: '#b45309' }}>
                      ⚠ {rec.prepNote}
                    </div>
                  )}

                  {/* Kit contents + notes */}
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '28px' }}>
                    <div>
                      <p style={{ fontSize: '10px', color: '#555', textTransform: 'uppercase', letterSpacing: '2px', marginBottom: '12px', fontWeight: 700 }}>Kit Contents</p>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                        {rec.items.map((item, i) => (
                          <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '8px', fontSize: '13px', color: '#8a9ab0' }}>
                            <div style={{ width: '6px', height: '6px', background: '#CC1F28', borderRadius: '50%', marginTop: '5px', flexShrink: 0 }} />
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
                            <p key={i} style={{ fontSize: '12px', color: '#8a9ab0', lineHeight: 1.55, borderLeft: '2px solid #CC1F28', paddingLeft: '10px' }}>
                              {note}
                            </p>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Order action buttons */}
                  <div style={{ borderTop: '1px solid #1e1e1e', paddingTop: '24px' }}>
                    <p style={{ fontSize: '10px', color: '#555', textTransform: 'uppercase', letterSpacing: '2px', marginBottom: '14px', fontWeight: 700 }}>
                      Place Your Order
                    </p>
                    <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                      <a
                        href={buildWhatsAppUrl(sel, rec, bags)}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{
                          display: 'inline-flex', alignItems: 'center', gap: '8px',
                          background: '#25D366', color: '#fff',
                          padding: '12px 24px', fontSize: '14px', fontWeight: 600,
                          textDecoration: 'none', transition: 'background 150ms',
                          letterSpacing: '0.3px',
                        }}
                        onMouseEnter={e => { e.currentTarget.style.background = '#1EB857' }}
                        onMouseLeave={e => { e.currentTarget.style.background = '#25D366' }}>
                        <MessageCircle size={16} />
                        Order via WhatsApp
                      </a>
                      <a
                        href={buildEmailUrl(sel, rec, bags)}
                        style={{
                          display: 'inline-flex', alignItems: 'center', gap: '8px',
                          background: 'transparent',
                          border: '1.5px solid #CC1F28', color: '#CC1F28',
                          padding: '12px 24px', fontSize: '14px', fontWeight: 600,
                          textDecoration: 'none', transition: 'background 150ms, color 150ms',
                          letterSpacing: '0.3px',
                        }}
                        onMouseEnter={e => { e.currentTarget.style.background = '#CC1F28'; e.currentTarget.style.color = '#fff' }}
                        onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#CC1F28' }}>
                        <Mail size={16} />
                        Order via Email
                      </a>
                    </div>
                  </div>

                </motion.div>
                )
              })()}

            </AnimatePresence>
          </div>

          {/* Footer nav */}
          <div style={{ padding: '16px 28px', borderTop: '1px solid #1a1a1a', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            {done ? (
              <>
                <button onClick={reset}
                  style={{ background: 'transparent', border: '1px solid #2a2a2a', color: '#8a9ab0', padding: '10px 20px', fontSize: '13px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px', transition: 'all 150ms' }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor = '#CC1F28'; e.currentTarget.style.color = '#CC1F28' }}
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
                  Step {step + 1} of {TOTAL_STEPS}
                </span>

                <motion.button
                  onClick={() => canNext && go(1)}
                  whileTap={canNext ? { scale: 0.97 } : {}}
                  style={{
                    background: canNext ? '#CC1F28' : '#1a1a1a',
                    border: 'none', color: canNext ? '#fff' : '#333',
                    padding: '10px 24px', fontSize: '13px', fontWeight: 600,
                    cursor: canNext ? 'pointer' : 'not-allowed',
                    display: 'flex', alignItems: 'center', gap: '6px', transition: 'background 150ms',
                  }}
                  onMouseEnter={e => { if (canNext) e.currentTarget.style.background = '#C4530A' }}
                  onMouseLeave={e => { if (canNext) e.currentTarget.style.background = '#CC1F28' }}>
                  {step === TOTAL_STEPS - 1 ? 'Get Recommendation' : 'Next'} <ChevronRight size={14} />
                </motion.button>
              </>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
