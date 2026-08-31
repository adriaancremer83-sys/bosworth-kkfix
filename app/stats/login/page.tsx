import { Suspense } from 'react'
import LoginForm from './LoginForm'

export const metadata = { title: 'KK-Fix Scan Stats — Sign In' }

export default function StatsLoginPage() {
  return (
    <Suspense fallback={null}>
      <LoginForm />
    </Suspense>
  )
}
