'use client'

import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

interface UseAuthRedirectOptions {
  isAuthenticated: boolean
  isLoading: boolean
  whenAuthenticated?: string
  whenUnauthenticated?: string
}

/**
 * Centralized auth redirect behavior for auth/public/protected routes.
 */
export const useAuthRedirect = ({
  isAuthenticated,
  isLoading,
  whenAuthenticated,
  whenUnauthenticated,
}: UseAuthRedirectOptions) => {
  const router = useRouter()

  useEffect(() => {
    if (isLoading) return

    if (isAuthenticated && whenAuthenticated) {
      router.replace(whenAuthenticated)
      return
    }

    if (!isAuthenticated && whenUnauthenticated) {
      router.replace(whenUnauthenticated)
    }
  }, [isAuthenticated, isLoading, router, whenAuthenticated, whenUnauthenticated])
}

