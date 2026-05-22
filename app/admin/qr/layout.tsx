import AdminShell from '@/components/admin/AdminShell'

export default function QRLayout({ children }: { children: React.ReactNode }) {
  return (
    <AdminShell userEmail={undefined}>
      {children}
    </AdminShell>
  )
}
