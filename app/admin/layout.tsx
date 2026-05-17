import { headers } from 'next/headers'
import AdminShell from '@/components/admin/AdminShell'

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = headers().get('x-pathname') ?? ''

  if (pathname === '/admin/login') {
    return (
      <div className="min-h-screen" style={{ background: '#0A0A0A' }}>
        {children}
      </div>
    )
  }

  return (
    <AdminShell userEmail={undefined}>
      {children}
    </AdminShell>
  )
}
