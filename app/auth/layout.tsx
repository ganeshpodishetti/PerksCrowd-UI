import { AuthProvider } from '@/features/auth/contexts/AuthContext'

export default function LegacyAuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <AuthProvider>{children}</AuthProvider>
}

