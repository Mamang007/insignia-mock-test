import { createFileRoute } from '@tanstack/react-router'
import { useTransactions } from '@/features/wallet/api/wallet'
import { Card, CardContent } from '@/components/ui/card'
import { useState } from 'react'
import { 
  ChevronLeft, 
  ChevronRight, 
  ArrowUpRight, 
  Plus, 
  Search,
  Filter
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

export const Route = createFileRoute('/admin/history')({
  component: AdminHistory,
})

function AdminHistory() {
  const { data: transactionsRes, isLoading } = useTransactions()
  const [currentPage, setCurrentPage] = useState(1)
  const [searchTerm, setSearchTerm] = useState('')
  const itemsPerPage = 10

  const transactions = transactionsRes?.data || []
  
  const filteredTransactions = transactions.filter(tx => 
    tx.sender?.username?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    tx.receiver?.username?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    tx.type.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const totalPages = Math.ceil(filteredTransactions.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const paginatedTransactions = filteredTransactions.slice(startIndex, startIndex + itemsPerPage)

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <h2 className="text-3xl font-bold tracking-tight text-gray-900">Global Transaction History</h2>
        <div className="relative w-full md:w-64">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <Input 
            placeholder="Search transactions..." 
            className="pl-10"
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value)
              setCurrentPage(1)
            }}
          />
        </div>
      </div>

      <Card className="border-none shadow-sm overflow-hidden bg-white">
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Type</th>
                  <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Sender</th>
                  <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Receiver</th>
                  <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Amount</th>
                  <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {isLoading ? (
                  <tr>
                    <td colSpan={5} className="px-6 py-12 text-center text-gray-500 italic">Loading transactions...</td>
                  </tr>
                ) : paginatedTransactions.length > 0 ? (
                  paginatedTransactions.map((tx) => (
                    <tr key={tx.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <div className={`p-1.5 rounded-full ${tx.type === 'TOPUP' ? 'bg-green-100 text-green-600' : 'bg-blue-100 text-blue-600'}`}>
                            {tx.type === 'TOPUP' ? <Plus size={14} /> : <ArrowUpRight size={14} />}
                          </div>
                          <span className="text-sm font-medium">{tx.type}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">
                        {tx.sender?.username || <span className="text-gray-400">System (Top-up)</span>}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">
                        {tx.receiver?.username}
                      </td>
                      <td className="px-6 py-4">
                        <span className={`text-sm font-bold ${tx.type === 'TOPUP' ? 'text-green-600' : 'text-blue-600'}`}>
                          Rp {Number(tx.amount).toLocaleString()}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500">
                        {new Date(tx.createdAt).toLocaleDateString('en-GB', {
                          day: '2-digit',
                          month: 'short',
                          year: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={5} className="px-6 py-12 text-center text-gray-500 italic">No transactions found</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between bg-white px-4 py-3 rounded-lg border shadow-sm">
          <div className="flex-1 flex justify-between sm:hidden">
            <Button
              variant="outline"
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
            >
              Previous
            </Button>
            <Button
              variant="outline"
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
            >
              Next
            </Button>
          </div>
          <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
            <div>
              <p className="text-sm text-gray-700">
                Showing <span className="font-medium">{startIndex + 1}</span> to <span className="font-medium">{Math.min(startIndex + itemsPerPage, filteredTransactions.length)}</span> of{' '}
                <span className="font-medium">{filteredTransactions.length}</span> results
              </p>
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
              >
                <ChevronLeft size={16} />
              </Button>
              <div className="flex items-center gap-1 px-4 text-sm font-medium">
                Page {currentPage} of {totalPages}
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
              >
                <ChevronRight size={16} />
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
