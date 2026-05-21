import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

async function computeExpectedToken(password: string): Promise<string> {
  const data = new TextEncoder().encode(password + 'kk-fix-session-v1')
  const buf  = await crypto.subtle.digest('SHA-256', data)
  return Array.from(new Uint8Array(buf)).map(b => b.toString(16).padStart(2, '0')).join('')
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Always forward the pathname so admin layout can skip auth wrapper on login
  const requestHeaders = new Headers(request.headers)
  requestHeaders.set('x-pathname', pathname)

  // Gate /admin/* UI routes and /api/admin/* API routes
  const isAdminRoute = pathname.startsWith('/admin') || pathname.startsWith('/api/admin')
  const isPublicAdminPath = pathname === '/admin/login'

  if (isAdminRoute && !isPublicAdminPath) {
    const password = process.env.ADMIN_PASSWORD

    // If no password configured (e.g. dev without .env.local), let through
    if (password) {
      const token    = request.cookies.get('kk-admin')?.value
      const expected = await computeExpectedToken(password)

      if (token !== expected) {
        const loginUrl = new URL('/admin/login', request.url)
        // Preserve intended destination so we can redirect after login
        loginUrl.searchParams.set('from', pathname)
        return NextResponse.redirect(loginUrl)
      }
    }
  }

  return NextResponse.next({ request: { headers: requestHeaders } })
}

export const config = {
  matcher: ['/admin/:path*', '/api/admin/:path*'],
}
