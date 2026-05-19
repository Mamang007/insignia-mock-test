import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate, Link } from '@tanstack/react-router';
import { RegisterSchema } from 'shared';
import type { RegisterInput } from 'shared';
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

import { useAuth } from '../context/auth-context';

export const RegisterForm: React.FC = () => {
  const navigate = useNavigate();
  const { register } = useAuth();
  const form = useForm<RegisterInput>({
    resolver: zodResolver(RegisterSchema),
    defaultValues: {
      username: '',
      password: '',
    },
  });

  const onSubmit = async (data: RegisterInput) => {
    try {
      await register(data);
      navigate({ to: '/login' });
    } catch (error) {
      console.error('Registration failed:', error);
    }
  };

  const isPending = form.formState.isSubmitting;

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="username"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Username</FormLabel>
              <FormControl>
                <Input placeholder="Choose a username" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Password</FormLabel>
              <FormControl>
                <Input type="password" placeholder="Create a password" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button 
          type="submit" 
          className="w-full" 
          disabled={isPending}
        >
          {isPending ? 'Creating wallet...' : 'Create Wallet'}
        </Button>
        <p className="text-center text-sm text-gray-500 mt-4">
          Already have a wallet?{' '}
          <Link to="/login" className="text-primary hover:underline">
            Login here
          </Link>
        </p>
      </form>
    </Form>
  );
};
