import { AuthProvider } from '@/features/auth/contexts/AuthContext'
import { UnreadDealsProvider } from '@/features/deals/contexts/UnreadDealsContext'
import { ProtectedRoute } from '@/features/auth/components/ProtectedRoute/ProtectedRoute'

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
