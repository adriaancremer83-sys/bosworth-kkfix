import { createServerSupabaseClient } from '@/lib/supabase-server'
import AdminSidebar from '@/components/admin/AdminSidebar'

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
    <div className="min-h-screen flex" style={{ background: '#0F0F0F' }}>
      <AdminSidebar userEmail={session.user.email} />
      <main className="flex-1 ml-[260px] p-8 overflow-auto min-h-screen">
        {children}
      </main>
    </div>
  )
}
