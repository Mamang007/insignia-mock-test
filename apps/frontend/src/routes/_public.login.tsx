import { createFileRoute, redirect } from '@tanstack/react-router'
import { LoginForm } from '@/features/auth/components/LoginForm'

export const Route = createFileRoute('/_public/login')({
  beforeLoad: ({ context }) => {
    if (context.auth.isAuthenticated) {
      throw redirect({ to: context.auth.isAdmin ? '/admin' : '/user' })
    }
  },
  component: LoginComponent,
})

function LoginComponent() {
  return (
    <div className="container mx-auto px-4 py-16 flex flex-col items-center">
      <h2 className="text-3xl font-bold mb-6">Login to your Wallet</h2>
      <p className="text-gray-600 mb-8 text-center max-w-md">
        Please enter your credentials to access your account.
      </p>
      <div className="w-full max-w-sm p-6 bg-white rounded-xl shadow-sm border text-left">
        <LoginForm />
      </div>
    </div>
  )
}
