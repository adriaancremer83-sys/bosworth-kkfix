'use client'

import { usePathname, useRouter } from 'next/navigation'
import Link from 'next/link'
import { LayoutDashboard, Package, PlusCircle, QrCode, ScanLine, LogOut, ArrowLeft } from 'lucide-react'
import Image from 'next/image'

interface AdminSidebarProps {
  userEmail: string | undefined
  onClose?: () => void
}

const navLinks = [
  { href: '/admin/products', icon: LayoutDashboard, label: 'Dashboard',      exact: true },
  { href: '/admin/products', icon: Package,         label: 'Products',        exact: true },
  { href: '/admin/products/new', icon: PlusCircle,  label: 'Add Product',     exact: false },
  { href: '/admin/qr',       icon: QrCode,          label: 'QR Generator',    exact: false },
  { href: '/admin/scans',    icon: ScanLine,        label: 'Scan Dashboard',  exact: false },
]

const ORANGE = '#E8650A'

export default function AdminSidebar({ userEmail, onClose }: AdminSidebarProps) {
  const pathname = usePathname()
  const router = useRouter()

  async function handleLogout() {
    await fetch('/api/admin/logout', { method: 'POST' })
    router.push('/admin/login')
    router.refresh()
  }

  function isActive(href: string, exact: boolean) {
    if (exact) return pathname === href
    return pathname.startsWith(href)
  }

  return (
    <aside className="h-full w-[260px] flex flex-col"
      style={{ background: '#0A0A0A', borderRight: '1px solid #1e1e1e' }}>
      <div className="p-6 pb-4">
        <div style={{ position: 'relative', height: '28px', width: '120px', marginBottom: '4px' }}>
          <Image
            src="/images/bosworth-logo-new.png"
            alt="Bosworth"
            fill
            style={{ objectFit: 'contain', objectPosition: 'left center' }}
            priority
          />
        </div>
        <p style={{ fontSize: '10px', letterSpacing: '3px', textTransform: 'uppercase', color: '#555', marginTop: '4px' }}>
          Admin Portal
        </p>
        <div className="mt-4 h-px" style={{ background: ORANGE, opacity: 0.4 }} />
      </div>

      <nav className="flex-1 px-3 py-2">
        {navLinks.map(({ href, icon: Icon, label, exact }) => {
          const active = isActive(href, exact)
          return (
            <Link
              key={`${href}-${label}`}
              href={href}
              onClick={onClose}
              className="flex items-center gap-3 px-3 py-2.5 mb-0.5 text-sm font-medium transition-all"
              style={{
                color: active ? ORANGE : '#8A8A8A',
                background: active ? 'rgba(232,101,10,0.08)' : 'transparent',
                borderLeft: `3px solid ${active ? ORANGE : 'transparent'}`,
                textDecoration: 'none',
                display: 'flex',
              }}
              onMouseEnter={e => { if (!active) e.currentTarget.style.background = '#111' }}
              onMouseLeave={e => { if (!active) e.currentTarget.style.background = 'transparent' }}>
              <Icon size={15} />
              {label}
            </Link>
          )
        })}
      </nav>

      <div className="p-4 mt-auto" style={{ borderTop: '1px solid #111' }}>
        {userEmail && (
          <p className="text-xs mb-3 truncate" style={{ color: '#555' }}>{userEmail}</p>
        )}
        <Link
          href="/products/kk-fix"
          onClick={onClose}
          className="flex items-center gap-2 w-full px-3 py-2 mb-1 text-sm"
          style={{ color: '#8A8A8A', background: 'transparent', textDecoration: 'none', display: 'flex' }}
          onMouseEnter={e => { e.currentTarget.style.color = '#f0f0f0'; e.currentTarget.style.background = '#111' }}
          onMouseLeave={e => { e.currentTarget.style.color = '#8A8A8A'; e.currentTarget.style.background = 'transparent' }}>
          <ArrowLeft size={13} />
          View Site
        </Link>
        <button
          onClick={handleLogout}
          className="flex items-center gap-2 w-full px-3 py-2 text-sm transition-colors"
          style={{ color: '#8A8A8A', background: 'transparent', border: 'none', cursor: 'pointer', fontFamily: 'Inter, sans-serif' }}
          onMouseEnter={e => { e.currentTarget.style.color = ORANGE }}
          onMouseLeave={e => { e.currentTarget.style.color = '#8A8A8A' }}>
          <LogOut size={13} />
          Sign Out
        </button>
      </div>
    </aside>
  )
}
