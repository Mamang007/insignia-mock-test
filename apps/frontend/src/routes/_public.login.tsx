import { createFileRoute, redirect } from '@tanstack/react-router'

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
      <div className="w-full max-w-sm p-6 bg-white rounded-xl shadow-sm border">
        {/* Login form will be implemented in a future task */}
        <p className="text-center text-gray-400 italic">Login form placeholder</p>
      </div>
    </div>
  )
}
