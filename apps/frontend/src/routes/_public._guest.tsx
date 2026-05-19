import { createFileRoute, redirect, Outlet } from '@tanstack/react-router'

export const Route = createFileRoute('/_public/_guest')({
  beforeLoad: ({ context }) => {
    if (context.auth.isAuthenticated) {
      throw redirect({ to: context.auth.isAdmin ? '/admin' : '/user' })
    }
  },
  component: () => <Outlet />,
})
