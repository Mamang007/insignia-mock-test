import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { ArrowUpRight, ArrowDownLeft, Plus } from 'lucide-react';
import { useAuth } from '@/features/auth/context/auth-context';

interface Transaction {
  id: string;
  type: 'TOPUP' | 'TRANSFER';
  amount: number;
  senderId?: string | null;
  receiverId: string;
  createdAt: string;
  sender?: { username: string } | null;
  receiver?: { username: string } | null;
}

export const TransactionList: React.FC<{ transactions: Transaction[] }> = ({ transactions }) => {
  const { user } = useAuth();
  const currentUserId = user?.id;

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
      {transactions.map((tx) => {
        const isReceiver = tx.receiverId === currentUserId;
        const isSender = tx.senderId === currentUserId;
        const isTopup = tx.type === 'TOPUP' || !tx.senderId;

        let label = '';
        let amountPrefix = '';
        let amountColor = '';
        let Icon = Plus;
        let iconBg = '';
        let iconColor = '';

        if (isTopup) {
          label = 'Wallet Top-up';
          amountPrefix = '+';
          amountColor = 'text-green-600';
          Icon = Plus;
          iconBg = 'bg-green-100';
          iconColor = 'text-green-600';
        } else if (isReceiver) {
          label = `Transfer from ${tx.sender?.username || 'Unknown'}`;
          amountPrefix = '+';
          amountColor = 'text-green-600';
          Icon = ArrowDownLeft;
          iconBg = 'bg-green-100';
          iconColor = 'text-green-600';
        } else if (isSender) {
          label = `Transfer to ${tx.receiver?.username || 'Unknown'}`;
          amountPrefix = '-';
          amountColor = 'text-red-600';
          Icon = ArrowUpRight;
          iconBg = 'bg-red-100';
          iconColor = 'text-red-600';
        } else {
          // Fallback for Admin view or other cases
          label = `${tx.sender?.username} to ${tx.receiver?.username}`;
          amountPrefix = '';
          amountColor = 'text-gray-900';
          Icon = ArrowUpRight;
          iconBg = 'bg-gray-100';
          iconColor = 'text-gray-600';
        }

        return (
          <Card key={tx.id} className="overflow-hidden border-none shadow-sm bg-white hover:shadow-md transition-shadow">
            <CardContent className="p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-full ${iconBg} ${iconColor}`}>
                  <Icon size={20} />
                </div>
                <div>
                  <p className="font-bold text-sm text-gray-900">{label}</p>
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
              <p className={`font-bold ${amountColor}`}>
                {amountPrefix} Rp {tx.amount.toLocaleString()}
              </p>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};
