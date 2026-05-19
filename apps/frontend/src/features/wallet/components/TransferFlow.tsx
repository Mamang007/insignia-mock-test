import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { TransferSchema, type TransferInput } from 'shared';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Search, UserPlus, Send, Trash2, User as UserIcon } from 'lucide-react';
import { useCheckUser, useTransfer } from '../api/wallet';
import { useRecipients } from '../hooks/use-recipients';
import { useNavigate } from '@tanstack/react-router';

export const TransferFlow: React.FC = () => {
  const navigate = useNavigate();
  const { recipients, addRecipient, removeRecipient } = useRecipients();
  const { mutateAsync: checkUser, isPending: isChecking } = useCheckUser();
  const { mutateAsync: transfer, isPending: isTransferring } = useTransfer();
  
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRecipient, setSelectedRecipient] = useState<string | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const form = useForm<TransferInput>({
    resolver: zodResolver(TransferSchema),
    defaultValues: {
      toUsername: '',
      amount: 0,
    },
  });

  const handleSearch = async () => {
    if (!searchQuery) return;
    setError(null);
    try {
      const response = await checkUser(searchQuery);
      if (response.data?.exists) {
        addRecipient(response.data.username);
        setSearchQuery('');
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'User not found');
    }
  };

  const openTransferDialog = (username: string) => {
    setSelectedRecipient(username);
    form.setValue('toUsername', username);
    setIsDialogOpen(true);
  };

  const onSubmitTransfer = async (data: TransferInput) => {
    try {
      await transfer(data);
      setIsDialogOpen(false);
      navigate({ to: '/user' });
    } catch (err: any) {
      setError(err.response?.data?.message || 'Transfer failed');
    }
  };

  return (
    <div className="space-y-6">
      {/* Search Section */}
      <div className="space-y-2">
        <label className="text-sm font-medium text-gray-700">Add New Recipient</label>
        <div className="flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <Input
              placeholder="Enter username"
              className="pl-10 h-11"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
            />
          </div>
          <Button 
            onClick={handleSearch} 
            disabled={isChecking || !searchQuery}
            className="h-11"
          >
            {isChecking ? '...' : <UserPlus size={20} />}
          </Button>
        </div>
        {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
      </div>

      {/* Recipient List */}
      <div className="space-y-4">
        <h3 className="font-bold text-lg">My Recipients</h3>
        {recipients.length === 0 ? (
          <div className="p-8 text-center text-gray-500 italic border rounded-xl bg-gray-50">
            No recipients saved yet. Search for a username above to add them.
          </div>
        ) : (
          <div className="space-y-3">
            {recipients.map((username) => (
              <Card key={username} className="overflow-hidden hover:border-primary transition-colors group">
                <CardContent className="p-4 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-gray-100 rounded-full text-gray-600">
                      <UserIcon size={20} />
                    </div>
                    <p className="font-bold">{username}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-red-500 hover:text-red-700 hover:bg-red-50"
                      onClick={() => removeRecipient(username)}
                    >
                      <Trash2 size={18} />
                    </Button>
                    <Button
                      size="sm"
                      className="flex items-center gap-2"
                      onClick={() => openTransferDialog(username)}
                    >
                      <Send size={16} />
                      Send
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Transfer Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-md rounded-2xl">
          <DialogHeader>
            <DialogTitle>Send Money</DialogTitle>
            <DialogDescription>
              Sending money to <span className="font-bold text-primary">@{selectedRecipient}</span>
            </DialogDescription>
          </DialogHeader>
          
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmitTransfer)} className="space-y-4 py-4">
              <FormField
                control={form.control}
                name="amount"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Amount</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 font-bold">
                          Rp
                        </span>
                        <Input
                          type="number"
                          placeholder="0"
                          className="pl-10 h-12 text-lg font-bold"
                          {...field}
                          onChange={(e) => field.onChange(Number(e.target.value))}
                        />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <DialogFooter className="mt-6">
                <Button 
                  type="submit" 
                  className="w-full h-12 text-lg font-bold"
                  disabled={isTransferring || form.watch('amount') <= 0}
                >
                  {isTransferring ? 'Processing...' : 'Confirm Transfer'}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  );
};
