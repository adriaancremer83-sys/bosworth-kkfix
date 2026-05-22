import AdminShell from '@/components/admin/AdminShell'

export default function ProductsLayout({ children }: { children: React.ReactNode }) {
  return (
    <AdminShell userEmail={undefined}>
      {children}
    </AdminShell>
  )
}
