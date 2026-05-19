import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { ArrowUpRight, ArrowDownLeft, Plus } from 'lucide-react';

interface Transaction {
  id: string;
  type: 'TOPUP' | 'TRANSFER';
  amount: number;
  senderId?: string;
  receiverId: string;
  createdAt: string;
  sender?: { username: string };
  receiver?: { username: string };
}

export const TransactionList: React.FC<{ transactions: Transaction[] }> = ({ transactions }) => {
  if (transactions.length === 0) {
    return (
      <Card>
        <CardContent className="p-8 text-center text-gray-500 italic">
          No transactions yet.
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-3">
      {transactions.map((tx) => (
        <Card key={tx.id} className="overflow-hidden">
          <CardContent className="p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className={`p-2 rounded-full ${
                tx.type === 'TOPUP' ? 'bg-green-100 text-green-600' : 'bg-blue-100 text-blue-600'
              }`}>
                {tx.type === 'TOPUP' ? <Plus size={20} /> : <ArrowUpRight size={20} />}
              </div>
              <div>
                <p className="font-bold text-sm">
                  {tx.type === 'TOPUP' ? 'Wallet Top-up' : `Transfer to ${tx.receiver?.username}`}
                </p>
                <p className="text-xs text-gray-500">
                  {new Date(tx.createdAt).toLocaleDateString('en-GB', {
                    day: '2-digit',
                    month: 'short',
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </p>
              </div>
            </div>
            <p className={`font-bold ${tx.type === 'TOPUP' ? 'text-green-600' : 'text-red-600'}`}>
              {tx.type === 'TOPUP' ? '+' : '-'} Rp {tx.amount.toLocaleString()}
            </p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};
