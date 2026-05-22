import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { TopupSchema, type TopupInput } from 'shared';
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
import { useTopup } from '../api/wallet';
import { useNavigate } from '@tanstack/react-router';

const PRESET_AMOUNTS = [10000, 20000, 50000, 100000, 200000, 500000];

export const TopupForm: React.FC = () => {
  const navigate = useNavigate();
  const { mutateAsync: topup, isPending } = useTopup();
  const [isCustom, setIsCustom] = useState(false);

  const form = useForm<TopupInput>({
    resolver: zodResolver(TopupSchema),
    defaultValues: {
      amount: 0,
    },
  });

  const onSubmit = async (data: TopupInput) => {
    try {
      await topup(data);
      navigate({ to: '/user' });
    } catch (error) {
      console.error('Top-up failed:', error);
    }
  };

  const handlePresetSelect = (amount: number) => {
    form.setValue('amount', amount);
    setIsCustom(false);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        {!isCustom ? (
          <div className="grid grid-cols-2 gap-4">
            {PRESET_AMOUNTS.map((amount) => (
              <Button
                key={amount}
                type="button"
                variant={form.watch('amount') === amount ? 'default' : 'outline'}
                className="h-16 text-lg font-bold"
                onClick={() => handlePresetSelect(amount)}
              >
                Rp {amount.toLocaleString()}
              </Button>
            ))}
            <Button
              type="button"
              variant="outline"
              className="h-16 text-lg font-bold col-span-2"
              onClick={() => setIsCustom(true)}
            >
              Other Amount
            </Button>
          </div>
        ) : (
          <FormField
            control={form.control}
            name="amount"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Custom Amount</FormLabel>
                <FormControl>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 font-bold">
                      Rp
                    </span>
                    <Input
                      type="number"
                      placeholder="Enter amount"
                      className="pl-10 h-12 text-lg"
                      {...field}
                      onChange={(e) => field.onChange(Number(e.target.value))}
                    />
                  </div>
                </FormControl>
                <FormMessage />
                <Button
                  type="button"
                  variant="link"
                  className="px-0"
                  onClick={() => setIsCustom(false)}
                >
                  Back to presets
                </Button>
              </FormItem>
            )}
          />
        )}

        <Button
          type="submit"
          className="w-full h-12 text-lg font-bold"
          disabled={isPending || form.watch('amount') <= 0}
        >
          {isPending ? 'Processing...' : 'Top-up Now'}
        </Button>
      </form>
    </Form>
  );
};
