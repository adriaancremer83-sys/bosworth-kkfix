import { createServiceSupabaseClient } from '@/lib/supabase-server'
import ScansClient from '@/components/stats/ScansClient'
import StatsHeader from './StatsHeader'

export const dynamic = 'force-dynamic'

export default async function StatsPage() {
  const supabase = createServiceSupabaseClient()
  const { data } = await supabase
    .from('qr_scans')
    .select('*')
    .order('timestamp', { ascending: false })
    .limit(1000)

  return (
    <div style={{ background: '#0a0a0a', minHeight: '100vh', color: '#f0f0f0' }}>
      <StatsHeader />
      <main style={{ maxWidth: '1100px', margin: '0 auto', padding: 'clamp(16px, 4vw, 32px)' }}>
        <ScansClient initialScans={data ?? []} />
      </main>
    </div>
  )
}
