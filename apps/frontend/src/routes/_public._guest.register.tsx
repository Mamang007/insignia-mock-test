import { createFileRoute } from '@tanstack/react-router'
import { RegisterForm } from '@/features/auth/components/RegisterForm'

export const Route = createFileRoute('/_public/_guest/register')({
  component: RegisterComponent,
})

function RegisterComponent() {
  return (
    <div className="container mx-auto px-4 py-16 flex flex-col items-center">
      <h2 className="text-3xl font-bold mb-6">Create new wallet</h2>
      <p className="text-gray-600 mb-8 text-center max-w-md">
        Join Insignia Wallet today and start managing your digital assets with ease.
      </p>
      <div className="w-full max-w-sm p-6 bg-white rounded-xl shadow-sm border text-left">
        <RegisterForm />
      </div>
    </div>
  )
}
