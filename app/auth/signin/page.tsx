'use client';

import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { signIn } from 'next-auth/react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Card, CardContent } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

const signInSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

type SignInFormValues = z.infer<typeof signInSchema>;

export default function SignIn() {
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get('callbackUrl') || '/dashboard';
  const router = useRouter();

  const form = useForm<SignInFormValues>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  useEffect(() => {
    console.log('SignIn: Page loaded, callbackUrl:', callbackUrl);
    // Prevent accidental reloads
    window.onbeforeunload = () => {
      console.log('SignIn: Preventing page reload');
      return 'Are you sure you want to leave?';
    };
    return () => {
      window.onbeforeunload = null;
    };
  }, [callbackUrl]);

  const onSubmit = async (values: SignInFormValues) => {
    console.log('SignIn: Attempting sign-in with:', {
      email: values.email,
      hasPassword: !!values.password,
    });
    try {
      const result = await signIn('credentials', {
        email: values.email,
        password: values.password,
        redirect: false,
      });
      console.log('SignIn: Result:', result);
      if (result?.error) {
        console.error('SignIn: Error:', result.error);
        form.setError('root', {
          type: 'manual',
          message:
            result.error === 'CredentialsSignin'
              ? 'Invalid email or password'
              : 'Authentication failed. Please try again.',
        });
        return;
      }
      console.log('SignIn: Success, redirecting to:', callbackUrl);
      router.push(callbackUrl);
    } catch (err: unknown) {
      console.error('SignIn: Unexpected error:', err);
      form.setError('root', {
        type: 'manual',
        message: 'An unexpected error occurred. Please try again.',
      });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md shadow-xl rounded-2xl">
        <CardContent className="p-6">
          <h2 className="text-2xl font-bold text-center mb-6">Sign In</h2>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input type="email" placeholder="you@example.com" {...field} />
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
                      <Input type="password" placeholder="Enter your password" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {form.formState.errors.root && (
                <p className="text-destructive text-center text-sm">
                  {form.formState.errors.root.message}
                </p>
              )}
              <Button type="submit" className="w-full mt-4">
                Sign In
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}