import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

async function computeExpectedToken(password: string): Promise<string> {
  const data = new TextEncoder().encode(password + 'kk-fix-session-v1')
  const buf  = await crypto.subtle.digest('SHA-256', data)
  return Array.from(new Uint8Array(buf)).map(b => b.toString(16).padStart(2, '0')).join('')
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  const isStatsRoute = pathname.startsWith('/stats') || pathname.startsWith('/api/stats')
  const isPublicStatsPath = pathname === '/stats/login' || pathname === '/api/stats/login'

  if (isStatsRoute && !isPublicStatsPath) {
    const password = process.env.ADMIN_PASSWORD

    // Fail closed: with no ADMIN_PASSWORD configured there is no valid session,
    // so /stats must never be reachable (the login route also rejects in that case).
    const token    = request.cookies.get('kk-stats')?.value
    const expected = password ? await computeExpectedToken(password) : null

    if (!expected || token !== expected) {
      const loginUrl = new URL('/stats/login', request.url)
      loginUrl.searchParams.set('from', pathname)
      return NextResponse.redirect(loginUrl)
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/stats/:path*', '/api/stats/:path*'],
}
