'use client'

import { usePathname, useRouter } from 'next/navigation'
import Link from 'next/link'
import { LayoutDashboard, Package, PlusCircle, QrCode, LogOut, ArrowLeft } from 'lucide-react'
import { createClient } from '@/lib/supabase'

interface AdminSidebarProps {
  userEmail: string | undefined
  onClose?: () => void
}

const navLinks = [
  { href: '/admin/products', icon: LayoutDashboard, label: 'Dashboard' },
  { href: '/admin/products', icon: Package, label: 'Products' },
  { href: '/admin/products/new', icon: PlusCircle, label: 'Add Product' },
  { href: '/admin/qr', icon: QrCode, label: 'QR Generator' },
]

export default function AdminSidebar({ userEmail, onClose }: AdminSidebarProps) {
  const pathname = usePathname()
  const router = useRouter()
  const supabase = createClient()

  async function handleLogout() {
    await supabase.auth.signOut()
    router.push('/admin/login')
    router.refresh()
  }

  return (
    <aside className="h-full w-[260px] flex flex-col"
      style={{ background: '#0A0A0A', borderRight: '1px solid #383838' }}>
      <div className="p-6 pb-4">
        <p className="font-display text-2xl tracking-widest" style={{ color: '#C8102E' }}>BOSWORTH</p>
        <p className="text-xs tracking-widest uppercase mt-0.5" style={{ color: '#8A8A8A', fontFamily: 'DM Sans, sans-serif' }}>
          Admin Portal
        </p>
        <div className="mt-4 h-px" style={{ background: '#C8102E', opacity: 0.5 }} />
      </div>

      <nav className="flex-1 px-3 py-2">
        {navLinks.map(({ href, icon: Icon, label }) => {
          const isActive = pathname === href || (href !== '/admin/products' && pathname.startsWith(href))
          return (
            <Link
              key={`${href}-${label}`}
              href={href}
              onClick={onClose}
              className="flex items-center gap-3 px-3 py-2.5 rounded mb-1 text-sm font-medium transition-all"
              style={{
                color: isActive ? '#C8102E' : '#8A8A8A',
                background: isActive ? 'rgba(200,16,46,0.08)' : 'transparent',
                borderLeft: isActive ? '3px solid #C8102E' : '3px solid transparent',
              }}
              onMouseEnter={(e) => {
                if (!isActive) e.currentTarget.style.background = '#1C1C1C'
              }}
              onMouseLeave={(e) => {
                if (!isActive) e.currentTarget.style.background = 'transparent'
              }}>
              <Icon size={16} />
              {label}
            </Link>
          )
        })}
      </nav>

      <div className="p-4 mt-auto" style={{ borderTop: '1px solid #1C1C1C' }}>
        {userEmail && (
          <p className="text-xs mb-3 truncate" style={{ color: '#8A8A8A' }}>{userEmail}</p>
        )}
        <Link
          href="/products/kk-fix"
          onClick={onClose}
          className="flex items-center gap-2 w-full px-3 py-2 rounded text-sm mb-1"
          style={{ color: '#8A8A8A', background: 'transparent' }}
          onMouseEnter={(e) => { e.currentTarget.style.color = '#F5F5F0'; e.currentTarget.style.background = '#1C1C1C' }}
          onMouseLeave={(e) => { e.currentTarget.style.color = '#8A8A8A'; e.currentTarget.style.background = 'transparent' }}>
          <ArrowLeft size={14} />
          Back to Site
        </Link>
        <button
          onClick={handleLogout}
          className="flex items-center gap-2 w-full px-3 py-2 rounded text-sm transition-colors"
          style={{ color: '#8A8A8A', background: 'transparent' }}
          onMouseEnter={(e) => { e.currentTarget.style.color = '#C8102E' }}
          onMouseLeave={(e) => { e.currentTarget.style.color = '#8A8A8A' }}>
          <LogOut size={14} />
          Sign Out
        </button>
      </div>
    </aside>
  )
}
