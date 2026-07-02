import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

async function computeExpectedToken(password: string): Promise<string> {
  const data = new TextEncoder().encode(password + 'kk-fix-session-v1')
  const buf  = await crypto.subtle.digest('SHA-256', data)
  return Array.from(new Uint8Array(buf)).map(b => b.toString(16).padStart(2, '0')).join('')
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  const isAdminRoute = pathname.startsWith('/admin') || pathname.startsWith('/api/admin')
  const isPublicAdminPath = pathname === '/admin/login' || pathname === '/api/admin/login'

  if (isAdminRoute && !isPublicAdminPath) {
    const password = process.env.ADMIN_PASSWORD

    // Fail closed: with no ADMIN_PASSWORD configured there is no valid session,
    // so admin must never be reachable (the login route also rejects in that case).
    const token    = request.cookies.get('kk-admin')?.value
    const expected = password ? await computeExpectedToken(password) : null

    if (!expected || token !== expected) {
      const loginUrl = new URL('/admin/login', request.url)
      loginUrl.searchParams.set('from', pathname)
      return NextResponse.redirect(loginUrl)
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/admin/:path*', '/api/admin/:path*'],
}
