import { createFileRoute, Link } from '@tanstack/react-router'
import { ChevronLeft, Award, TrendingUp } from 'lucide-react'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  Cell
} from 'recharts'
import { useTopTransactions, useTopUsers } from '@/features/stats/api/stats'
import { TransactionList } from '@/features/wallet/components/TransactionList'
import { useAuth } from '@/features/auth/hooks/auth-context'

export const Route = createFileRoute('/user/stats')({
  component: UserStatsPage,
})

function UserStatsPage() {
  const { user } = useAuth()
  const { data: topTxRes, isLoading: isTxLoading } = useTopTransactions()
  const { data: topUsersRes, isLoading: isUsersLoading } = useTopUsers()

  const topTransactions = topTxRes?.data || []
  const topRecipients = topUsersRes?.data || []

  const chartData = topTransactions.slice(0, 5).map(tx => {
    let name = ''
    if (tx.type === 'TOPUP' || !tx.senderId) {
      name = 'Top-up'
    } else if (tx.receiverId === user?.id) {
      name = `From: ${tx.sender?.username || 'Unknown'}`
    } else {
      name = `To: ${tx.receiver?.username || 'Unknown'}`
    }
    
    return {
      name,
      amount: Number(tx.amount)
    }
  })

  const COLORS = ['#0ea5e9', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];

  return (
    <div className="space-y-6 pb-8">
      <div className="flex items-center gap-2">
        <Link to="/user" className="p-1 -ml-1 hover:bg-gray-100 rounded-full">
          <ChevronLeft className="w-6 h-6" />
        </Link>
        <h2 className="text-2xl font-bold">Personal Analytics</h2>
      </div>

      <Card className="border-none shadow-sm bg-white overflow-hidden">
        <CardHeader className="pb-2">
          <div className="flex items-center gap-2 text-primary font-bold">
            <TrendingUp size={20} />
            <CardTitle className="text-lg">Top Transactions</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <div className="h-[200px] w-full mt-2">
            {isTxLoading ? (
              <div className="h-full flex items-center justify-center text-gray-400 italic">Loading...</div>
            ) : chartData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                  <XAxis 
                    dataKey="name" 
                    fontSize={10} 
                    tick={{ fill: '#6b7280' }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <YAxis hide />
                  <Tooltip 
                    formatter={(value: any) => [`Rp ${Number(value).toLocaleString()}`, 'Amount']}
                    contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                  />
                  <Bar dataKey="amount" radius={[4, 4, 0, 0]}>
                    {chartData.map((_, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center text-gray-400 italic">No data yet</div>
            )}
          </div>
        </CardContent>
      </Card>

      <div className="space-y-4">
        <div className="flex items-center gap-2 font-bold text-gray-900">
          <Award size={20} className="text-orange-500" />
          <h3>Top Recipients</h3>
        </div>
        
        {isUsersLoading ? (
          <div className="p-8 text-center text-gray-400 italic">Loading...</div>
        ) : topRecipients.length > 0 ? (
          <div className="space-y-3">
            {topRecipients.map((recipient, i) => (
              <Card key={recipient.username} className="border-none shadow-sm overflow-hidden">
                <CardContent className="p-4 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-orange-100 text-orange-600 flex items-center justify-center text-xs font-bold">
                      {i + 1}
                    </div>
                    <p className="font-bold text-sm">{recipient.username}</p>
                  </div>
                  <p className="font-bold text-sm text-primary">Rp {Number(recipient.totalSent).toLocaleString()}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <Card className="border-none shadow-sm">
            <CardContent className="p-8 text-center text-gray-500 italic">
              No transfer data yet.
            </CardContent>
          </Card>
        )}
      </div>

      <div className="space-y-4">
        <h3 className="font-bold text-gray-900">Highest Value Details</h3>
        <TransactionList transactions={topTransactions} />
      </div>
    </div>
  )
}
