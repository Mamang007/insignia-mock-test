import { createFileRoute, Link, Outlet, redirect } from '@tanstack/react-router'
import { useAuth } from '@/features/auth/context/auth-context'
import { Button } from '@/components/ui/button'
import { 
  LayoutDashboard, 
  History, 
  Users, 
  LogOut 
} from 'lucide-react'

export const Route = createFileRoute('/admin')({
  beforeLoad: ({ context }) => {
    if (!context.auth.isAuthenticated) {
      throw redirect({ to: '/login' })
    }
    if (context.auth.user?.role !== 'ADMIN') {
      throw redirect({ to: '/user' })
    }
  },
  component: AdminLayout,
})

function AdminLayout() {
  const { user, logout } = useAuth()

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      <header className="h-16 bg-white border-b px-6 flex items-center justify-between sticky top-0 z-20">
        <div className="flex items-center gap-4">
          <span className="font-bold text-xl text-primary">Insignia Admin</span>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-sm font-medium">Administrator: {user?.username}</span>
          <Button variant="outline" size="sm" onClick={() => logout()}>
            <LogOut className="w-4 h-4 mr-2" />
            Logout
          </Button>
        </div>
      </header>

      <div className="flex flex-1">
        <aside className="w-64 bg-white border-r hidden md:flex flex-col sticky top-16 h-[calc(100vh-64px)]">
          <nav className="p-4 space-y-2">
            <Link 
              to="/admin" 
              activeOptions={{ exact: true }}
              className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-gray-100 [&.active]:bg-primary [&.active]:text-white"
            >
              <LayoutDashboard className="w-5 h-5" />
              Dashboard
            </Link>
            <Link 
              to="/admin/history" 
              className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-gray-100 [&.active]:bg-primary [&.active]:text-white"
            >
              <History className="w-5 h-5" />
              Transaction History
            </Link>
            <Link 
              to="/admin/user-manager" 
              className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-gray-100 [&.active]:bg-primary [&.active]:text-white"
            >
              <Users className="w-5 h-5" />
              User Manager
            </Link>
          </nav>
        </aside>

        <main className="flex-1 p-6 max-w-5xl mx-auto w-full">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
