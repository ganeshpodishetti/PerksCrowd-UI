import { AuthProvider } from '@/features/auth/contexts/AuthContext'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  robots: {
    index: false,
    follow: false,
  },
}

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <AuthProvider>
      <div className="min-h-screen bg-background dark:bg-background safe-area-shell">
        {children}
      </div>
    </AuthProvider>
  )
}
