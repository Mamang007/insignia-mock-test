import { createFileRoute, Link } from '@tanstack/react-router'
import { useAuth } from '@/features/auth/context/auth-context'
import { Button } from '@/components/ui/button'

export const Route = createFileRoute('/_public/')({
  component: Index,
})

function Index() {
  const { isAuthenticated, isAdmin, logout } = useAuth()

  return (
    <div className="container mx-auto px-4 py-16 flex flex-col items-center text-center">
      <div className="max-w-2xl">
        <h1 className="text-5xl font-extrabold tracking-tight mb-6">
          Welcome to <span className="text-primary">Insignia Wallet</span>
        </h1>
        <p className="text-xl text-gray-600 mb-10">
          The most secure and easy-to-use digital wallet for all your daily transactions. 
          Send, receive, and manage your funds with confidence.
        </p>

        <div className="flex flex-wrap justify-center gap-4">
          {isAuthenticated ? (
            <>
              <Button size="lg" asChild>
                <Link to={isAdmin ? '/admin' : '/user'}>Go to Dashboard</Link>
              </Button>
              <Button size="lg" variant="outline" onClick={() => logout()}>
                Logout
              </Button>
            </>
          ) : (
            <>
              <Button size="lg" asChild>
                <Link to="/login">Login</Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link to="/register">Register</Link>
              </Button>
            </>
          )}
        </div>
      </div>

      <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="p-6 bg-white rounded-xl shadow-sm border">
          <h3 className="text-xl font-bold mb-2">Instant Top-up</h3>
          <p className="text-gray-600">Add funds to your wallet instantly using various payment methods.</p>
        </div>
        <div className="p-6 bg-white rounded-xl shadow-sm border">
          <h3 className="text-xl font-bold mb-2">Fast Transfers</h3>
          <p className="text-gray-600">Send money to any Insignia Wallet user by just their username.</p>
        </div>
        <div className="p-6 bg-white rounded-xl shadow-sm border">
          <h3 className="text-xl font-bold mb-2">Admin Dashboard</h3>
          <p className="text-gray-600">Powerful tools for administrators to monitor transactions and users.</p>
        </div>
      </div>
    </div>
  )
}
