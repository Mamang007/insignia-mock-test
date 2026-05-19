import { createFileRoute, Link } from '@tanstack/react-router'
import { ChevronLeft } from 'lucide-react'
import { TransferFlow } from '@/features/wallet/components/TransferFlow'

export const Route = createFileRoute('/user/transfer')({
  component: TransferPage,
})

function TransferPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <Link to="/user" className="p-1 -ml-1 hover:bg-gray-100 rounded-full">
          <ChevronLeft className="w-6 h-6" />
        </Link>
        <h2 className="text-2xl font-bold">Transfer Funds</h2>
      </div>

      <div className="bg-white p-6 rounded-xl border shadow-sm">
        <p className="text-gray-500 mb-6">Send money to other users by their username.</p>
        <TransferFlow />
      </div>
    </div>
  )
}
