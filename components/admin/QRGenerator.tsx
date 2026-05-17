'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import QRCode from 'qrcode'
import JSZip from 'jszip'
import { Download, Printer, Package } from 'lucide-react'
import type { Product } from '@/lib/types'

interface QRGeneratorProps {
  products: Product[]
  initialProductId?: string
}

type ErrorLevel = 'L' | 'M' | 'Q' | 'H'

const inputStyle = {
  background: '#1C1C1C',
  border: '1px solid #383838',
  color: '#F5F5F0',
  borderRadius: '6px',
  padding: '10px 14px',
  fontSize: '13px',
  outline: 'none',
  width: '100%',
  fontFamily: 'DM Sans, sans-serif',
}

export default function QRGenerator({ products, initialProductId }: QRGeneratorProps) {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'
  const [selectedId, setSelectedId] = useState(initialProductId ?? products[0]?.id ?? '')
  const [errorLevel, setErrorLevel] = useState<ErrorLevel>('H')
  const [margin, setMargin] = useState(2)
  const [fgColor, setFgColor] = useState('#F5F5F0')
  const [bgColor, setBgColor] = useState('#0A0A0A')
  const [qrDataUrl, setQrDataUrl] = useState('')
  const [downloading, setDownloading] = useState(false)
  const [batchDownloading, setBatchDownloading] = useState(false)

  const selectedProduct = products.find(p => p.id === selectedId)
  const productUrl = selectedProduct ? `${baseUrl}/products/${selectedProduct.slug}` : ''

  const generateQR = useCallback(async (url: string, size: number) => {
    return QRCode.toDataURL(url, {
      errorCorrectionLevel: errorLevel,
      margin,
      color: { dark: fgColor, light: bgColor },
      width: size,
    })
  }, [errorLevel, margin, fgColor, bgColor])

  useEffect(() => {
    if (!productUrl) return
    generateQR(productUrl, 300).then(setQrDataUrl).catch(console.error)
  }, [productUrl, generateQR])

  async function downloadPng(size: number) {
    if (!productUrl || !selectedProduct) return
    setDownloading(true)
    try {
      const dataUrl = await generateQR(productUrl, size)
      const a = document.createElement('a')
      a.href = dataUrl
      a.download = `${selectedProduct.slug}-qr-${size}px.png`
      a.click()
    } finally {
      setDownloading(false)
    }
  }

  async function downloadSvg() {
    if (!productUrl || !selectedProduct) return
    setDownloading(true)
    try {
      const svg = await QRCode.toString(productUrl, {
        type: 'svg',
        errorCorrectionLevel: errorLevel,
        margin,
        color: { dark: fgColor, light: bgColor },
      })
      const blob = new Blob([svg], { type: 'image/svg+xml' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `${selectedProduct.slug}-qr.svg`
      a.click()
      URL.revokeObjectURL(url)
    } finally {
      setDownloading(false)
    }
  }

  async function downloadBatchZip() {
    setBatchDownloading(true)
    try {
      const zip = new JSZip()
      const activeProducts = products.filter(p => p.is_active)
      for (const product of activeProducts) {
        const url = `${baseUrl}/products/${product.slug}`
        const dataUrl = await generateQR(url, 1000)
        const base64 = dataUrl.split(',')[1]
        zip.file(`${product.slug}-qr.png`, base64, { base64: true })
      }
      const blob = await zip.generateAsync({ type: 'blob' })
      const a = document.createElement('a')
      a.href = URL.createObjectURL(blob)
      a.download = 'bosworth-qr-codes.zip'
      a.click()
      URL.revokeObjectURL(a.href)
    } finally {
      setBatchDownloading(false)
    }
  }

  function handlePrint() {
    window.print()
  }

  const btnStyle = (color = '#C8102E') => ({
    background: color,
    color: '#F5F5F0',
    border: 'none',
    borderRadius: '6px',
    padding: '10px 16px',
    fontSize: '13px',
    fontWeight: 500,
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    width: '100%',
    justifyContent: 'center' as const,
    fontFamily: 'DM Sans, sans-serif',
    letterSpacing: '0.03em',
  })

  return (
    <>
      <div className="no-print grid md:grid-cols-2 gap-8">
        <div>
          <h1 className="font-display text-5xl tracking-wide mb-6" style={{ color: '#F5F5F0' }}>QR Code Generator</h1>

          <div className="flex flex-col gap-5 p-6 rounded-lg mb-6" style={{ background: '#1C1C1C', border: '1px solid #383838' }}>
            <div>
              <label className="block text-xs mb-1.5 uppercase tracking-wide" style={{ color: '#8A8A8A' }}>Product</label>
              <select value={selectedId} onChange={e => setSelectedId(e.target.value)} style={inputStyle}>
                {products.map(p => (
                  <option key={p.id} value={p.id}>{p.name}{p.part_number ? ` — ${p.part_number}` : ''}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs mb-1.5 uppercase tracking-wide" style={{ color: '#8A8A8A' }}>URL Encoded</label>
              <div className="px-3 py-2.5 rounded text-xs font-mono break-all" style={{ background: '#0A0A0A', border: '1px solid #383838', color: '#8A8A8A' }}>
                {productUrl}
              </div>
            </div>

            <div>
              <label className="block text-xs mb-2 uppercase tracking-wide" style={{ color: '#8A8A8A' }}>Error Correction</label>
              <div className="flex gap-2">
                {(['L', 'M', 'Q', 'H'] as ErrorLevel[]).map(level => (
                  <button
                    key={level}
                    type="button"
                    onClick={() => setErrorLevel(level)}
                    className="flex-1 py-2 rounded text-xs font-medium transition-all"
                    style={{
                      background: errorLevel === level ? '#C8102E' : '#0A0A0A',
                      color: errorLevel === level ? '#F5F5F0' : '#8A8A8A',
                      border: `1px solid ${errorLevel === level ? '#C8102E' : '#383838'}`,
                    }}>
                    {level}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-xs mb-2 uppercase tracking-wide" style={{ color: '#8A8A8A' }}>Margin: {margin}</label>
              <input type="range" min={1} max={4} value={margin} onChange={e => setMargin(Number(e.target.value))}
                className="w-full accent-red-600" style={{ accentColor: '#C8102E' }} />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs mb-1.5 uppercase tracking-wide" style={{ color: '#8A8A8A' }}>Foreground</label>
                <div className="flex gap-2 items-center">
                  <input type="color" value={fgColor} onChange={e => setFgColor(e.target.value)}
                    className="w-10 h-10 rounded cursor-pointer" style={{ border: '1px solid #383838', background: 'none', padding: '2px' }} />
                  <span className="text-xs font-mono" style={{ color: '#8A8A8A' }}>{fgColor}</span>
                </div>
              </div>
              <div>
                <label className="block text-xs mb-1.5 uppercase tracking-wide" style={{ color: '#8A8A8A' }}>Background</label>
                <div className="flex gap-2 items-center">
                  <input type="color" value={bgColor} onChange={e => setBgColor(e.target.value)}
                    className="w-10 h-10 rounded cursor-pointer" style={{ border: '1px solid #383838', background: 'none', padding: '2px' }} />
                  <span className="text-xs font-mono" style={{ color: '#8A8A8A' }}>{bgColor}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-3 mb-6">
            <button style={btnStyle()} onClick={() => downloadPng(300)} disabled={downloading || !selectedProduct}>
              <Download size={14} /> Download PNG (300px)
            </button>
            <button style={btnStyle('#383838')} onClick={() => downloadPng(1000)} disabled={downloading || !selectedProduct}>
              <Download size={14} /> Download PNG (1000px — Print)
            </button>
            <button style={btnStyle('#242424')} onClick={downloadSvg} disabled={downloading || !selectedProduct}>
              <Download size={14} /> Download SVG — Vector
            </button>
            <button style={{ ...btnStyle('#0A0A0A'), border: '1px solid #383838' }} onClick={handlePrint} disabled={!selectedProduct}>
              <Printer size={14} /> Print Label
            </button>
          </div>

          <div className="p-5 rounded-lg" style={{ background: '#1C1C1C', border: '1px solid #383838' }}>
            <h2 className="font-display text-2xl mb-1 tracking-wide" style={{ color: '#F5F5F0' }}>Batch Export</h2>
            <p className="text-xs mb-4" style={{ color: '#8A8A8A' }}>Generate QR codes for all active products as a ZIP archive</p>
            <button style={btnStyle('#1C1C1C')}
              onClick={downloadBatchZip}
              disabled={batchDownloading}
              onMouseEnter={e => { e.currentTarget.style.background = '#C8102E' }}
              onMouseLeave={e => { e.currentTarget.style.background = '#1C1C1C' }}>
              <Package size={14} />
              {batchDownloading ? 'Generating…' : 'Download All as ZIP'}
            </button>
          </div>
        </div>

        <div className="flex flex-col items-center">
          <div className="relative p-8 rounded-lg w-full max-w-sm"
            style={{ background: '#1C1C1C', border: '1px solid #383838' }}>
            <div className="absolute top-3 left-3 w-5 h-5 pointer-events-none"
              style={{ borderTop: '2px solid #C8102E', borderLeft: '2px solid #C8102E' }} />
            <div className="absolute top-3 right-3 w-5 h-5 pointer-events-none"
              style={{ borderTop: '2px solid #C8102E', borderRight: '2px solid #C8102E' }} />
            <div className="absolute bottom-3 left-3 w-5 h-5 pointer-events-none"
              style={{ borderBottom: '2px solid #C8102E', borderLeft: '2px solid #C8102E' }} />
            <div className="absolute bottom-3 right-3 w-5 h-5 pointer-events-none"
              style={{ borderBottom: '2px solid #C8102E', borderRight: '2px solid #C8102E' }} />

            <div className="flex justify-center mb-4">
              {qrDataUrl ? (
                <img src={qrDataUrl} alt="QR Code" className="rounded" style={{ width: '240px', height: '240px', imageRendering: 'pixelated' }} />
              ) : (
                <div className="flex items-center justify-center rounded" style={{ width: '240px', height: '240px', background: '#0A0A0A', border: '1px solid #383838' }}>
                  <p className="text-xs" style={{ color: '#8A8A8A' }}>Select a product</p>
                </div>
              )}
            </div>

            {selectedProduct && (
              <div className="text-center">
                <p className="font-display text-xl tracking-wide" style={{ color: '#F5F5F0' }}>{selectedProduct.name}</p>
                {selectedProduct.part_number && (
                  <p className="text-xs mt-0.5 font-mono" style={{ color: '#8A8A8A' }}>{selectedProduct.part_number}</p>
                )}
                <p className="text-xs mt-1 break-all" style={{ color: '#C8102E' }}>{productUrl}</p>
                <p className="text-xs mt-2 tracking-widest uppercase" style={{ color: '#8A8A8A' }}>Scan to View Product</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {selectedProduct && qrDataUrl && (
        <div className="print-layout" style={{ display: 'none' }}>
          <div style={{
            width: '85mm',
            height: '54mm',
            background: 'white',
            color: 'black',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '4mm',
            fontFamily: 'sans-serif',
            boxSizing: 'border-box',
          }}>
            <p style={{ fontSize: '14px', fontWeight: 900, letterSpacing: '3px', marginBottom: '2mm' }}>BOSWORTH</p>
            <img src={qrDataUrl} alt="QR" style={{ width: '30mm', height: '30mm' }} />
            <p style={{ fontSize: '10px', fontWeight: 700, marginTop: '2mm' }}>{selectedProduct.name}</p>
            {selectedProduct.part_number && (
              <p style={{ fontSize: '8px', color: '#555', marginTop: '1mm' }}>{selectedProduct.part_number}</p>
            )}
            <p style={{ fontSize: '6px', color: '#888', marginTop: '2mm', wordBreak: 'break-all', textAlign: 'center' }}>{productUrl}</p>
          </div>
        </div>
      )}

      <style>{`
        @media print {
          .no-print { display: none !important; }
          .print-layout { display: block !important; }
        }
      `}</style>
    </>
  )
}
