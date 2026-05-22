import { createFileRoute, redirect, Outlet, useNavigate } from '@tanstack/react-router'
import { useAuth } from '@/features/auth/hooks/auth-context'
import { useEffect } from 'react'

export const Route = createFileRoute('/_public/_guest')({
  beforeLoad: ({ context }) => {
    if (context.auth.isAuthenticated) {
      throw redirect({ to: context.auth.isAdmin ? '/admin' : '/user' })
    }
  },
  component: GuestLayout,
})

function GuestLayout() {
  const { isAuthenticated, isAdmin } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    if (isAuthenticated) {
      navigate({ to: isAdmin ? '/admin' : '/user', replace: true })
    }
  }, [isAuthenticated, isAdmin, navigate])

  return <Outlet />
}
