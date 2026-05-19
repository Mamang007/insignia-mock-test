import { createFileRoute, Link } from "@tanstack/react-router";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Send, BarChart2 } from "lucide-react";
import { useBalance, useTransactions } from "@/features/wallet/api/wallet";
import { TransactionList } from "@/features/wallet/components/TransactionList";

export const Route = createFileRoute("/user/")({
  component: UserDashboard,
});

function UserDashboard() {
  const { data: balanceRes, isLoading: isBalanceLoading } = useBalance();
  const { data: transactionsRes, isLoading: isTxLoading } = useTransactions();

  const balance = balanceRes?.data?.balance ?? 0;
  const transactions = transactionsRes?.data ?? [];

  return (
    <div className="space-y-6">
      <Card className="bg-primary text-white border-none shadow-lg">
        <CardHeader>
          <CardTitle className="text-sm font-medium opacity-80 uppercase tracking-wider">
            Total Balance
          </CardTitle>
          <div className="text-4xl font-bold mt-1">
            {isBalanceLoading ? (
              <span className="opacity-50 text-2xl">Loading...</span>
            ) : (
              `Rp ${balance.toLocaleString()}`
            )}
          </div>
        </CardHeader>
      </Card>

      <div className="grid grid-cols-3 gap-3">
        <Link to="/user/top-up">
          <Button className="w-full h-24 flex flex-col gap-2 shadow-sm p-2" variant="outline">
            <div className="p-2 bg-green-50 rounded-full">
              <Plus className="text-green-600" size={20} />
            </div>
            <span className="font-bold text-xs">Top-up</span>
          </Button>
        </Link>
        <Link to="/user/transfer">
          <Button className="w-full h-24 flex flex-col gap-2 shadow-sm p-2" variant="outline">
            <div className="p-2 bg-blue-50 rounded-full">
              <Send className="text-blue-600" size={20} />
            </div>
            <span className="font-bold text-xs">Transfer</span>
          </Button>
        </Link>
        <Link to="/user/stats">
          <Button className="w-full h-24 flex flex-col gap-2 shadow-sm p-2" variant="outline">
            <div className="p-2 bg-orange-50 rounded-full">
              <BarChart2 className="text-orange-600" size={20} />
            </div>
            <span className="font-bold text-xs">Stats</span>
          </Button>
        </Link>
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-bold text-lg">Recent Transactions</h3>
          <Link to="/user" className="text-sm text-primary font-medium hover:underline">
            View All
          </Link>
        </div>
        
        {isTxLoading ? (
          <div className="p-8 text-center text-gray-500">Loading transactions...</div>
        ) : (
          <TransactionList transactions={transactions} />
        )}
      </div>
    </div>
  );
}
