'use client'

import { useState } from 'react'
import { Menu } from 'lucide-react'
import AdminSidebar from './AdminSidebar'

interface AdminShellProps {
  userEmail: string | undefined
  children: React.ReactNode
}

export default function AdminShell({ userEmail, children }: AdminShellProps) {
  const [open, setOpen] = useState(false)

  return (
    <div className="min-h-screen flex" style={{ background: '#0F0F0F' }}>
      {open && (
        <div
          className="fixed inset-0 z-30 md:hidden"
          style={{ background: 'rgba(0,0,0,0.65)' }}
          onClick={() => setOpen(false)}
        />
      )}

      <div className={`fixed left-0 top-0 h-full z-40 transition-transform duration-300 md:translate-x-0 ${open ? 'translate-x-0' : '-translate-x-full'}`}
        style={{ width: '260px' }}>
        <AdminSidebar userEmail={userEmail} onClose={() => setOpen(false)} />
      </div>

      <div className="flex-1 md:ml-[260px] min-h-screen flex flex-col">
        <div className="flex items-center gap-3 px-4 py-3 md:hidden"
          style={{ background: '#0A0A0A', borderBottom: '1px solid #383838', position: 'sticky', top: 0, zIndex: 20 }}>
          <button
            onClick={() => setOpen(true)}
            className="p-1.5 rounded"
            style={{ color: '#F5F5F0', background: 'transparent' }}>
            <Menu size={22} />
          </button>
          <span className="font-display text-xl tracking-widest" style={{ color: '#E8650A' }}>KK-FIX</span>
          <span className="text-xs tracking-widest uppercase" style={{ color: '#8A8A8A' }}>Admin</span>
        </div>

        <main className="flex-1 p-4 md:p-8 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  )
}
