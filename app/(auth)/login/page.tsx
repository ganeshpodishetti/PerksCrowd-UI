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
      <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
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
