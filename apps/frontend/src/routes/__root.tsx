import { createRootRouteWithContext, Outlet } from '@tanstack/react-router'
import { TanStackRouterDevtools } from '@tanstack/router-devtools'
import type { AuthContextType } from '@/features/auth/types'

interface MyRouterContext {
  auth: AuthContextType
}

export const Route = createRootRouteWithContext<MyRouterContext>()({
  component: () => (
    <>
      <Outlet />
      <TanStackRouterDevtools />
    </>
  ),
})
