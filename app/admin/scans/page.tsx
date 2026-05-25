import { createServiceSupabaseClient } from '@/lib/supabase-server'
import ScansClient from '@/components/admin/ScansClient'

export const dynamic = 'force-dynamic'

export default async function ScansPage() {
  const supabase = createServiceSupabaseClient()
  const { data } = await supabase
    .from('qr_scans')
    .select('*')
    .order('timestamp', { ascending: false })
    .limit(1000)

  return <ScansClient initialScans={data ?? []} />
}
