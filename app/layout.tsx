import type { Metadata, Viewport } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Bosworth KK-FIX | Product Portal',
  description: 'Conveyor Belt & Rubber Lagging Repair Kit — Official product portal for Bosworth industrial repair systems.',
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
