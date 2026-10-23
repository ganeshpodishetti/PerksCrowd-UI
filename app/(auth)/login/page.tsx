import type { Metadata } from 'next'
import { Suspense } from 'react'
import LoginPage from './LoginPage'

export const metadata: Metadata = {
  title: 'Login - PerksCrowd',
  description: 'Sign in to your PerksCrowd account',
}

function LoginPageFallback() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="animate-spin rounded-full h-8 w-8 border-2 border-muted border-t-primary"></div>
    </div>
  )
}

export default function Login() {
  return (
    <Suspense fallback={<LoginPageFallback />}>
      <LoginPage />
    </Suspense>
  )
}
