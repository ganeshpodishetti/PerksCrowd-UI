import { ProtectedRoute } from '@/features/auth/components/ProtectedRoute/ProtectedRoute'
import { AuthProvider } from '@/features/auth/contexts/AuthContext'
import { UnreadDealsProvider } from '@/features/deals/contexts/UnreadDealsContext'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  robots: {
    index: false,
    follow: false,
  },
}

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <AuthProvider>
      <UnreadDealsProvider>
        <ProtectedRoute>
          {children}
        </ProtectedRoute>
      </UnreadDealsProvider>
    </AuthProvider>
  )
}
