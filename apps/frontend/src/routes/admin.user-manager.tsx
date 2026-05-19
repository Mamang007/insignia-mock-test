import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/admin/user-manager')({
  component: UserManager,
})

function UserManager() {
  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold tracking-tight">User Management</h2>
      <div className="p-12 text-center text-gray-500 italic border rounded-lg bg-white">
        User management table placeholder
      </div>
    </div>
  )
}
