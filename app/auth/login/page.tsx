import type { Metadata } from 'next'
import { Suspense } from 'react'
import LoginPage from '@/app/(auth)/login/LoginPage'

export const metadata: Metadata = {
  title: 'Login - StudentPerks',
  description: 'Sign in to your StudentPerks account',
}

function LoginPageFallback() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
    </div>
  )
}

export default function AuthLoginPage() {
  return (
    <Suspense fallback={<LoginPageFallback />}>
      <LoginPage />
    </Suspense>
  )
}

