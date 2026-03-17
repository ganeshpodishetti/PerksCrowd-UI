import { ProtectedRoute } from '@/features/auth/components/ProtectedRoute/ProtectedRoute'
import { AuthProvider } from '@/features/auth/contexts/AuthContext'
import { UnreadDealsProvider } from '@/features/deals/contexts/UnreadDealsContext'

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
