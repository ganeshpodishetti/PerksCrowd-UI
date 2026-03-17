import { AuthProvider } from '@/features/auth/contexts/AuthContext'
import { ProtectedRoute } from '@/features/auth/components/ProtectedRoute/ProtectedRoute'

export default function ProfileLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <AuthProvider>
      <ProtectedRoute>{children}</ProtectedRoute>
    </AuthProvider>
  )
}

