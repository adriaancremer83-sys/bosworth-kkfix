import { createServerSupabaseClient } from '@/lib/supabase-server'
import AdminShell from '@/components/admin/AdminShell'

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createServerSupabaseClient()
  const { data: { session } } = await supabase.auth.getSession()

  if (!session) {
    return (
      <div className="min-h-screen" style={{ background: '#0A0A0A' }}>
        {children}
      </div>
    )
  }

  return (
    <AdminShell userEmail={session.user.email}>
      {children}
    </AdminShell>
  )
}
