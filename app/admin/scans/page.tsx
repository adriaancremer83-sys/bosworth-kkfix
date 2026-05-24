'use client'

import { useState, useEffect, useMemo } from 'react'
import dynamic from 'next/dynamic'
import ScanErrorBoundary from '@/components/admin/ScanErrorBoundary'
import {
  MapPin, Monitor, Smartphone, Tablet,
  Download, RefreshCw, Loader2, Activity,
  Globe, Calendar, Package,
} from 'lucide-react'

const MAP_HEIGHT = 'clamp(240px, 50vw, 400px)'

const ScanMap = dynamic(() => import('@/components/admin/ScanMap'), {
  ssr: false,
  loading: () => (
    <div style={{ height: MAP_HEIGHT, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <Loader2 size={24} style={{ color: '#CC1F28', animation: 'spin 1s linear infinite' }} />
    </div>
  ),
})

const ScanLineChart = dynamic(() => import('@/components/admin/ScanLineChart'), {
  ssr: false,
  loading: () => (
    <div style={{ height: '160px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <Loader2 size={18} style={{ color: '#CC1F28', animation: 'spin 1s linear infinite' }} />
    </div>
  ),
})

interface Scan {
  id: string
  timestamp: string
  lat: number | null
  lng: number | null
  city: string | null
  region: string | null
  country: string | null
  device_type: string | null
  user_agent: string | null
  batch_id: string | null
  unit_id: string | null
  ip_address: string | null
  product_id: string | null
}

const CARD: React.CSSProperties = {
  background: '#111111',
  border: '1px solid #1e1e1e',
  padding: '20px 24px',
}

const ORANGE = '#CC1F28'

function StatCard({ label, value, icon: Icon, sub }: {
  label: string; value: string | number; icon: React.ElementType; sub?: string
}) {
  const isString = typeof value === 'string'
  return (
    <div style={CARD}>
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '8px' }}>
        <div style={{ minWidth: 0, flex: 1 }}>
          <p style={{ fontSize: '11px', color: '#555', textTransform: 'uppercase', letterSpacing: '1.5px', marginBottom: '8px' }}>{label}</p>
          <p style={{
            fontSize: isString ? 'clamp(16px, 4vw, 28px)' : '32px',
            fontWeight: 700, color: '#f0f0f0', lineHeight: 1.1,
            overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
          }}>{value}</p>
          {sub && <p style={{ fontSize: '12px', color: '#555', marginTop: '6px' }}>{sub}</p>}
        </div>
        <div style={{ background: 'rgba(232,101,10,0.1)', padding: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
          <Icon size={20} style={{ color: ORANGE }} />
        </div>
      </div>
    </div>
  )
}

function deviceIcon(type: string | null) {
  if (type === 'mobile') return <Smartphone size={13} style={{ color: '#8a9ab0' }} />
  if (type === 'tablet') return <Tablet size={13} style={{ color: '#8a9ab0' }} />
  return <Monitor size={13} style={{ color: '#8a9ab0' }} />
}

function exportCSV(scans: Scan[]) {
  const headers = ['Timestamp', 'City', 'Region', 'Country', 'Device', 'Batch', 'Unit', 'IP', 'Lat', 'Lng']
  const rows = scans.map(s => [
    s.timestamp, s.city ?? '', s.region ?? '', s.country ?? '',
    s.device_type ?? '', s.batch_id ?? '', s.unit_id ?? '',
    s.ip_address ?? '', s.lat ?? '', s.lng ?? '',
  ])
  const csv = [headers, ...rows]
    .map(row => row.map(v => `"${String(v).replace(/"/g, '""')}"`).join(','))
    .join('\n')
  const blob = new Blob([csv], { type: 'text/csv' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `kk-fix-scans-${new Date().toISOString().slice(0, 10)}.csv`
  a.click()
  URL.revokeObjectURL(url)
}

function buildDayCounts(scans: Scan[], days: number): { date: string; count: number }[] {
  const now = new Date()
  const counts: Record<string, number> = {}
  for (let i = days - 1; i >= 0; i--) {
    const d = new Date(now)
    d.setDate(d.getDate() - i)
    counts[d.toISOString().slice(0, 10)] = 0
  }
  scans.forEach(s => {
    const day = s.timestamp.slice(0, 10)
    if (day in counts) counts[day]++
  })
  return Object.entries(counts).map(([date, count]) => ({ date, count }))
}

export default function ScansPage() {
  const [scans, setScans] = useState<Scan[]>([])
  const [loading, setLoading] = useState(true)
  const [dateFrom, setDateFrom] = useState('')
  const [dateTo, setDateTo] = useState('')
  const [batchFilter, setBatchFilter] = useState('')
  const [locationFilter, setLocationFilter] = useState('')

  async function load() {
    setLoading(true)
    try {
      const res = await fetch('/api/admin/scans')
      if (!res.ok) throw new Error(`HTTP ${res.status}`)
      const data = await res.json()
      setScans(data as Scan[])
    } catch (err) {
      console.error('[scans page] load error:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    load()
    // Refresh whenever the admin switches back to this tab
    const onVisible = () => { if (document.visibilityState === 'visible') load() }
    document.addEventListener('visibilitychange', onVisible)
    return () => document.removeEventListener('visibilitychange', onVisible)
  }, [])

  const filtered = useMemo(() => {
    return scans.filter(s => {
      if (dateFrom && s.timestamp < dateFrom) return false
      if (dateTo && s.timestamp > dateTo + 'T23:59:59') return false
      if (batchFilter && !(s.batch_id ?? '').toLowerCase().includes(batchFilter.toLowerCase())) return false
      if (locationFilter) {
        const loc = `${s.city ?? ''} ${s.region ?? ''} ${s.country ?? ''}`.toLowerCase()
        if (!loc.includes(locationFilter.toLowerCase())) return false
      }
      return true
    })
  }, [scans, dateFrom, dateTo, batchFilter, locationFilter])

  const today = new Date().toISOString().slice(0, 10)
  const scansToday = scans.filter(s => s.timestamp.startsWith(today)).length
  const uniqueLocations = new Set(scans.map(s => `${s.city},${s.country}`).filter(x => x !== ',')).size
  const regionCounts = scans.reduce<Record<string, number>>((acc, s) => {
    const k = s.region ?? s.city ?? 'Unknown'
    acc[k] = (acc[k] ?? 0) + 1
    return acc
  }, {})
  const topRegion = Object.entries(regionCounts).sort((a, b) => b[1] - a[1])[0]?.[0] ?? '—'

  const dayCounts = buildDayCounts(scans, 30)
  const mapPoints = filtered
    .filter(s => s.lat != null && s.lng != null)
    .map(s => ({
      lat: s.lat!,
      lng: s.lng!,
      city: s.city,
      region: s.region,
      country: s.country,
      timestamp: s.timestamp,
    }))

  const inputStyle: React.CSSProperties = {
    background: '#0a0a0a',
    border: '1px solid #383838',
    color: '#f0f0f0',
    padding: '8px 12px',
    fontSize: '13px',
    outline: 'none',
    fontFamily: 'Inter, sans-serif',
  }

  return (
    <div>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px', marginBottom: '32px' }}>
        <div>
          <h1 style={{ fontSize: '28px', fontWeight: 700, color: '#f0f0f0', lineHeight: 1 }}>Scan Dashboard</h1>
          <p style={{ fontSize: '13px', color: '#555', marginTop: '4px' }}>QR code scan analytics — all products</p>
        </div>
        <div style={{ display: 'flex', gap: '8px' }}>
          <button onClick={load} style={{ ...inputStyle, display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer', border: '1px solid #383838', padding: '8px 14px' }}>
            {loading ? <Loader2 size={13} className="animate-spin" /> : <RefreshCw size={13} />}
            Refresh
          </button>
          <button
            onClick={() => exportCSV(filtered)}
            style={{ ...inputStyle, display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer', border: `1px solid ${ORANGE}`, color: ORANGE, padding: '8px 16px' }}>
            <Download size={13} /> Export CSV
          </button>
        </div>
      </div>

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))', gap: '12px', marginBottom: '32px' }}>
        <StatCard label="Total Scans" value={scans.length} icon={Activity} />
        <StatCard label="Scans Today" value={scansToday} icon={Calendar} />
        <StatCard label="Unique Locations" value={uniqueLocations} icon={Globe} />
        <StatCard label="Top Region" value={topRegion} icon={MapPin} sub="most active" />
      </div>

      {/* Chart */}
      <div style={{ ...CARD, marginBottom: '24px' }}>
        <p style={{ fontSize: '11px', color: '#555', textTransform: 'uppercase', letterSpacing: '1.5px', marginBottom: '16px' }}>
          Scans per day — last 30 days
        </p>
        <ScanErrorBoundary label="Chart" height="160px">
          <ScanLineChart data={dayCounts} />
        </ScanErrorBoundary>
      </div>

      {/* Map */}
      <div style={{ ...CARD, marginBottom: '24px', padding: '0', overflow: 'hidden' }}>
        <div style={{ padding: '16px 20px', borderBottom: '1px solid #1e1e1e', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <MapPin size={14} style={{ color: ORANGE }} />
          <p style={{ fontSize: '13px', color: '#f0f0f0', fontWeight: 500 }}>
            Scan Locations {mapPoints.length > 0 ? `(${mapPoints.length} with GPS)` : ''}
          </p>
        </div>
        {loading ? (
          <div style={{ height: MAP_HEIGHT, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Loader2 size={24} className="animate-spin" style={{ color: ORANGE }} />
          </div>
        ) : (
          <ScanErrorBoundary label="Map" height={MAP_HEIGHT}>
            <ScanMap points={mapPoints} />
          </ScanErrorBoundary>
        )}
      </div>

      {/* Filters */}
      <div style={{ ...CARD, marginBottom: '16px' }}>
        <p style={{ fontSize: '11px', color: '#555', textTransform: 'uppercase', letterSpacing: '1.5px', marginBottom: '14px' }}>Filters</p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))', gap: '10px' }}>
          <div>
            <label style={{ fontSize: '11px', color: '#555', display: 'block', marginBottom: '4px' }}>From date</label>
            <input type="date" value={dateFrom} onChange={e => setDateFrom(e.target.value)} style={{ ...inputStyle, width: '100%' }} />
          </div>
          <div>
            <label style={{ fontSize: '11px', color: '#555', display: 'block', marginBottom: '4px' }}>To date</label>
            <input type="date" value={dateTo} onChange={e => setDateTo(e.target.value)} style={{ ...inputStyle, width: '100%' }} />
          </div>
          <div>
            <label style={{ fontSize: '11px', color: '#555', display: 'block', marginBottom: '4px' }}>Batch ID</label>
            <input placeholder="e.g. BSW-2024-001" value={batchFilter} onChange={e => setBatchFilter(e.target.value)} style={{ ...inputStyle, width: '100%' }} />
          </div>
          <div>
            <label style={{ fontSize: '11px', color: '#555', display: 'block', marginBottom: '4px' }}>Location</label>
            <input placeholder="City, region, country…" value={locationFilter} onChange={e => setLocationFilter(e.target.value)} style={{ ...inputStyle, width: '100%' }} />
          </div>
          {(dateFrom || dateTo || batchFilter || locationFilter) && (
            <div style={{ display: 'flex', alignItems: 'flex-end' }}>
              <button onClick={() => { setDateFrom(''); setDateTo(''); setBatchFilter(''); setLocationFilter('') }}
                style={{ ...inputStyle, cursor: 'pointer', border: '1px solid #383838', color: '#8a9ab0', padding: '8px 14px', whiteSpace: 'nowrap' }}>
                Clear filters
              </button>
            </div>
          )}
        </div>
        {(dateFrom || dateTo || batchFilter || locationFilter) && (
          <p style={{ fontSize: '12px', color: '#555', marginTop: '10px' }}>
            Showing {filtered.length} of {scans.length} scans
          </p>
        )}
      </div>

      {/* Table */}
      <div style={{ ...CARD, padding: 0, overflow: 'hidden' }}>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: '700px' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid #1e1e1e' }}>
                {['Timestamp', 'Location', 'Device', 'Batch / Unit', 'IP'].map(h => (
                  <th key={h} style={{ padding: '12px 16px', textAlign: 'left', fontSize: '11px', color: '#555', textTransform: 'uppercase', letterSpacing: '1px', fontWeight: 600 }}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {loading && (
                <tr>
                  <td colSpan={5} style={{ textAlign: 'center', padding: '48px', color: '#555' }}>
                    <Loader2 size={20} className="animate-spin" style={{ color: ORANGE, display: 'inline-block' }} />
                  </td>
                </tr>
              )}
              {!loading && filtered.length === 0 && (
                <tr>
                  <td colSpan={5} style={{ textAlign: 'center', padding: '48px', color: '#555', fontSize: '13px' }}>
                    No scans yet. Scans appear here when someone scans a KK-Fix QR code.
                  </td>
                </tr>
              )}
              {filtered.map((scan, i) => (
                <tr key={scan.id}
                  style={{ borderBottom: '1px solid #111', background: i % 2 === 0 ? 'transparent' : 'rgba(255,255,255,0.01)' }}>
                  <td style={{ padding: '12px 16px', fontSize: '13px', color: '#8a9ab0', whiteSpace: 'nowrap' }}>
                    <div>{new Date(scan.timestamp).toLocaleDateString()}</div>
                    <div style={{ fontSize: '11px', color: '#444' }}>{new Date(scan.timestamp).toLocaleTimeString()}</div>
                  </td>
                  <td style={{ padding: '12px 16px', fontSize: '13px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <MapPin size={12} style={{ color: '#555', flexShrink: 0 }} />
                      <span style={{ color: '#f0f0f0' }}>
                        {scan.city ?? '—'}
                        {scan.region ? `, ${scan.region}` : ''}
                      </span>
                    </div>
                    {scan.country && <div style={{ fontSize: '11px', color: '#555', marginTop: '2px', paddingLeft: '18px' }}>{scan.country}</div>}
                  </td>
                  <td style={{ padding: '12px 16px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px', color: '#8a9ab0' }}>
                      {deviceIcon(scan.device_type)}
                      <span style={{ textTransform: 'capitalize' }}>{scan.device_type ?? '—'}</span>
                    </div>
                  </td>
                  <td style={{ padding: '12px 16px', fontSize: '12px' }}>
                    {scan.batch_id ? (
                      <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '5px', color: ORANGE }}>
                          <Package size={11} />
                          {scan.batch_id}
                        </div>
                        {scan.unit_id && <div style={{ color: '#555', marginTop: '2px', paddingLeft: '16px' }}>{scan.unit_id}</div>}
                      </div>
                    ) : (
                      <span style={{ color: '#333' }}>—</span>
                    )}
                  </td>
                  <td style={{ padding: '12px 16px', fontSize: '12px', color: '#444', fontFamily: 'JetBrains Mono, monospace' }}>
                    {scan.ip_address ?? '—'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
