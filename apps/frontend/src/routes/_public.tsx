import { createFileRoute, Link, Outlet } from '@tanstack/react-router'
import { useAuth } from '@/features/auth/context/auth-context'
import { Button } from '@/components/ui/button'

export const Route = createFileRoute('/_public')({
  component: PublicLayout,
})

function PublicLayout() {
  const { isAuthenticated, logout, isAdmin } = useAuth()

  return (
    <div className="min-h-screen flex flex-col">
      <header className="border-b bg-white">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <Link to="/" className="text-xl font-bold text-primary">
            Insignia Wallet
          </Link>
          <nav className="flex gap-4 items-center">
            {isAuthenticated ? (
              <>
                <Button variant="ghost" asChild>
                  <Link to={isAdmin ? '/admin' : '/user'}>Dashboard</Link>
                </Button>
                <Button variant="outline" onClick={() => logout()}>
                  Logout
                </Button>
              </>
            ) : (
              <>
                <Button variant="ghost" asChild>
                  <Link to="/login">Login</Link>
                </Button>
                <Button asChild>
                  <Link to="/register">Register</Link>
                </Button>
              </>
            )}
          </nav>
        </div>
      </header>
      <main className="flex-1">
        <Outlet />
      </main>
      <footer className="border-t py-8 bg-gray-50">
        <div className="container mx-auto px-4 text-center text-gray-500">
          © 2026 Insignia Wallet. All rights reserved.
        </div>
      </footer>
    </div>
  )
}
