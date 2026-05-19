import { createFileRoute } from '@tanstack/react-router'
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
import { useBalance } from '@/features/wallet/api/wallet'

export const Route = createFileRoute('/admin/')({
  component: AdminDashboard,
})

function AdminDashboard() {
  const { data: transactionsRes, isLoading: isTxLoading } = useTopTransactions()
  const { data: usersStatsRes, isLoading: isUsersStatsLoading } = useTopUsers()
  const { data: balancesRes, isLoading: isBalancesLoading } = useBalance()

  const transactions = transactionsRes?.data || []
  const usersStats = usersStatsRes?.data || []
  const allUsers = (balancesRes?.data as unknown as any[]) || []

  const totalUsers = allUsers.length
  const totalVolume = allUsers.reduce((acc, curr) => acc + (Number(curr.balance) || 0), 0)
  const activeAdmins = allUsers.filter(u => u.role === 'ADMIN').length

  const chartData = transactions.map(tx => ({
    name: tx.type === 'TOPUP' ? `Topup: ${tx.receiver?.username}` : `${tx.sender?.username} -> ${tx.receiver?.username}`,
    amount: Number(tx.amount),
    type: tx.type
  }))

  const COLORS = ['#0ea5e9', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight text-gray-900">Dashboard Overview</h2>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="border-none shadow-sm bg-white">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium text-gray-500">Total Users</CardTitle>
            <div className="p-2 bg-blue-50 rounded-lg text-blue-600">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">
              {isBalancesLoading ? '...' : totalUsers}
            </div>
            <p className="text-xs text-gray-500 mt-1">Including {activeAdmins} administrators</p>
          </CardContent>
        </Card>
        
        <Card className="border-none shadow-sm bg-white">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium text-gray-500">Circulating Supply</CardTitle>
            <div className="p-2 bg-green-50 rounded-lg text-green-600">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M16 8h-6a2 2 0 1 0 0 4h4a2 2 0 1 1 0 4H8"/><path d="M12 18V6"/></svg>
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-600">
              {isBalancesLoading ? '...' : `Rp ${totalVolume.toLocaleString()}`}
            </div>
            <p className="text-xs text-gray-500 mt-1">Total value across all wallets</p>
          </CardContent>
        </Card>

        <Card className="border-none shadow-sm bg-white">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium text-gray-500">Top Transaction</CardTitle>
            <div className="p-2 bg-orange-50 rounded-lg text-orange-600">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">
              {isTxLoading ? '...' : transactions.length > 0 ? `Rp ${Number(transactions[0].amount).toLocaleString()}` : 'Rp 0'}
            </div>
            <p className="text-xs text-gray-500 mt-1">Highest value single movement</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="border-none shadow-sm bg-white">
          <CardHeader>
            <CardTitle className="text-lg font-bold">Top 10 Transactions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px] w-full mt-4">
              {isTxLoading ? (
                <div className="h-full flex items-center justify-center text-gray-400 italic">Loading chart data...</div>
              ) : chartData.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={chartData} layout="vertical" margin={{ left: 20, right: 20 }}>
                    <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} stroke="#f0f0f0" />
                    <XAxis type="number" hide />
                    <YAxis 
                      dataKey="name" 
                      type="category" 
                      width={120} 
                      fontSize={10}
                      tick={{ fill: '#6b7280' }}
                    />
                    <Tooltip 
                      formatter={(value: number) => [`Rp ${value.toLocaleString()}`, 'Amount']}
                      contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                    />
                    <Bar dataKey="amount" radius={[0, 4, 4, 0]}>
                      {chartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-full flex items-center justify-center text-gray-400 italic">No transaction data available</div>
              )}
            </div>
          </CardContent>
        </Card>

        <Card className="border-none shadow-sm bg-white">
          <CardHeader>
            <CardTitle className="text-lg font-bold">Top Users by Volume</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4 mt-2">
              {isUsersStatsLoading ? (
                <div className="p-8 text-center text-gray-400 italic">Loading user statistics...</div>
              ) : usersStats.length > 0 ? (
                usersStats.map((u, i) => (
                  <div key={u.username} className="flex items-center justify-between group">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-xs font-bold text-gray-500 group-hover:bg-primary group-hover:text-white transition-colors">
                        {i + 1}
                      </div>
                      <div>
                        <p className="font-bold text-sm text-gray-900">{u.username}</p>
                        <p className="text-xs text-gray-500">Total processed volume</p>
                      </div>
                    </div>
                    <p className="font-bold text-sm text-primary">Rp {Number(u.total || u.totalSent).toLocaleString()}</p>
                  </div>
                ))
              ) : (
                <div className="p-8 text-center text-gray-400 italic">No user data available</div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
