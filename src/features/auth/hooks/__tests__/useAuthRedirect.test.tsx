import { render } from '@testing-library/react'
import React from 'react'
import { useAuthRedirect } from '../useAuthRedirect'

const mockReplace = jest.fn()

jest.mock('next/navigation', () => ({
  useRouter: () => ({
    replace: mockReplace,
  }),
}))

const Probe = ({
  isAuthenticated,
  isLoading,
  whenAuthenticated,
  whenUnauthenticated,
}: {
  isAuthenticated: boolean
  isLoading: boolean
  whenAuthenticated?: string
  whenUnauthenticated?: string
}) => {
  useAuthRedirect({
    isAuthenticated,
    isLoading,
    whenAuthenticated,
    whenUnauthenticated,
  })

  return null
}

describe('useAuthRedirect', () => {
  beforeEach(() => {
    mockReplace.mockClear()
  })

  it('redirects authenticated users to target route', () => {
    render(
      <Probe
        isAuthenticated
        isLoading={false}
        whenAuthenticated="/dashboard"
      />,
    )

    expect(mockReplace).toHaveBeenCalledWith('/dashboard')
  })

  it('redirects unauthenticated users to login route', () => {
    render(
      <Probe
        isAuthenticated={false}
        isLoading={false}
        whenUnauthenticated="/auth/login"
      />,
    )

    expect(mockReplace).toHaveBeenCalledWith('/auth/login')
  })

  it('does not redirect while loading', () => {
    render(
      <Probe
        isAuthenticated={false}
        isLoading
        whenUnauthenticated="/auth/login"
      />,
    )

    expect(mockReplace).not.toHaveBeenCalled()
  })
})


