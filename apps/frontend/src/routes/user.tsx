import { createFileRoute, Link, Outlet, redirect } from '@tanstack/react-router'
import { useAuth } from '@/features/auth/hooks/auth-context'
import { Button } from '@/components/ui/button'

export const Route = createFileRoute('/user')({
  beforeLoad: ({ context }) => {
    if (!context.auth.isAuthenticated) {
      throw redirect({ to: '/login' })
    }
    if (context.auth.user?.role !== 'USER') {
      throw redirect({ to: '/admin' })
    }
  },
  component: UserLayout,
})

function UserLayout() {
  const { user, logout } = useAuth()

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center">
      <div className="w-full max-w-md bg-white min-h-screen shadow-lg flex flex-col">
        <header className="border-b px-4 h-16 flex items-center justify-between sticky top-0 bg-white z-10">
          <Link to="/user" className="font-bold text-primary">
            Wallet
          </Link>
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-600">Hello, {user?.username}</span>
            <Button variant="ghost" size="sm" onClick={() => logout()}>
              Logout
            </Button>
          </div>
        </header>
        <main className="flex-1 p-4">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
