import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

async function hashToken(password: string): Promise<string> {
  const data = new TextEncoder().encode(password + 'kk-fix-session-v1')
  const buf  = await crypto.subtle.digest('SHA-256', data)
  return Array.from(new Uint8Array(buf)).map(b => b.toString(16).padStart(2, '0')).join('')
}

export async function POST(request: Request) {
  try {
    const { password } = await request.json()
    const expected = process.env.ADMIN_PASSWORD

    if (!expected) {
      return NextResponse.json({ error: 'ADMIN_PASSWORD not configured' }, { status: 500 })
    }

    if (!password || password !== expected) {
      // Constant-time-ish: always hash before returning to avoid timing hints
      await hashToken(password ?? '')
      return NextResponse.json({ error: 'Invalid password' }, { status: 401 })
    }

    const token = await hashToken(expected)

    const res = NextResponse.json({ ok: true })
    res.cookies.set('kk-admin', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: '/',
    })
    return res
  } catch {
    return NextResponse.json({ error: 'Login failed' }, { status: 500 })
  }
}
