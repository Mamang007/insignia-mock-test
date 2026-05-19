import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/user/transfer')({
  component: TransferPage,
})

function TransferPage() {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Transfer Funds</h2>
      <div className="p-8 text-center text-gray-500 italic border rounded-lg bg-white">
        Transfer feature placeholder
      </div>
    </div>
  )
}
