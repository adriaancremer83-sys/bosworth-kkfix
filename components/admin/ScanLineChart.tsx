'use client'

interface DayCount {
  date: string   // YYYY-MM-DD
  count: number
}

interface ScanLineChartProps {
  data: DayCount[]
}

export default function ScanLineChart({ data }: ScanLineChartProps) {
  if (data.length === 0) {
    return (
      <div style={{ height: '160px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <p style={{ fontSize: '13px', color: '#555' }}>No data yet</p>
      </div>
    )
  }

  const W = 600
  const H = 160
  const PAD = { top: 16, right: 16, bottom: 32, left: 36 }
  const chartW = W - PAD.left - PAD.right
  const chartH = H - PAD.top - PAD.bottom

  const maxCount = Math.max(...data.map(d => d.count), 1)

  const pts = data.map((d, i) => ({
    x: PAD.left + (i / (data.length - 1 || 1)) * chartW,
    y: PAD.top + chartH - (d.count / maxCount) * chartH,
    ...d,
  }))

  const pathD = pts.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ')
  const fillD = `${pathD} L ${pts[pts.length - 1].x} ${PAD.top + chartH} L ${pts[0].x} ${PAD.top + chartH} Z`

  // Y-axis ticks (0, max/2, max)
  const yTicks = [0, Math.round(maxCount / 2), maxCount]

  // X-axis labels: first, middle, last
  const xLabels = [0, Math.floor(data.length / 2), data.length - 1]
    .filter((v, i, a) => a.indexOf(v) === i)
    .map(i => ({ i, label: data[i]?.date.slice(5) ?? '' })) // MM-DD

  return (
    <svg viewBox={`0 0 ${W} ${H}`} style={{ width: '100%', height: '160px', overflow: 'visible' }}>
      {/* Grid lines */}
      {yTicks.map(t => {
        const y = PAD.top + chartH - (t / maxCount) * chartH
        return (
          <g key={t}>
            <line x1={PAD.left} y1={y} x2={PAD.left + chartW} y2={y}
              stroke="#1e1e1e" strokeWidth="1" />
            <text x={PAD.left - 6} y={y + 4} fontSize="10" fill="#555" textAnchor="end">
              {t}
            </text>
          </g>
        )
      })}

      {/* Fill area */}
      <path d={fillD} fill="rgba(232,101,10,0.08)" />

      {/* Line */}
      <path d={pathD} fill="none" stroke="#E8650A" strokeWidth="2" strokeLinejoin="round" strokeLinecap="round" />

      {/* Dots */}
      {pts.map((p, i) => (
        <circle key={i} cx={p.x} cy={p.y} r="3" fill="#E8650A" />
      ))}

      {/* X labels */}
      {xLabels.map(({ i, label }) => (
        <text key={i} x={pts[i]?.x ?? 0} y={H - 6} fontSize="10" fill="#555" textAnchor="middle">
          {label}
        </text>
      ))}
    </svg>
  )
}
