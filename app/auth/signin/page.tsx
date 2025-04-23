// app/auth/signin/page.tsx
'use client';
import { signIn } from 'next-auth/react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';

export default function SignIn() {
  const [error, setError] = useState('');
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get('callbackUrl') || '/dashboard';

  const handleGoogleSignIn = async () => {
    try {
      const result = await signIn('google', { redirect: false, callbackUrl });
      if (result?.error) {
        setError('Failed to sign in with Google');
      } else {
        router.push(callbackUrl);
      }
    } catch (err) {
      setError('An unexpected error occurred');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-dark">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-dark/80 backdrop-blur-md p-8 rounded-lg shadow-lg w-full max-w-md border border-champagne-gold/30"
      >
        <h1 className="text-3xl font-playfair font-bold mb-6 text-center text-gold">Sign In</h1>
        {error && <p className="text-red-400 mb-4 text-center font-lora">{error}</p>}
        <p className="text-light mb-6 text-center font-lora">
          Sign in to manage events and access your dashboard.
        </p>
        <motion.button
          whileHover={{ scale: 1.05, backgroundColor: '#E6C200' }}
          whileTap={{ scale: 0.95 }}
          onClick={handleGoogleSignIn}
          className="w-full bg-gold text-dark p-3 rounded-md font-lora font-medium hover:bg-champagne-gold transition-colors"
        >
          Sign In with Google
        </motion.button>
        <p className="mt-4 text-center text-light/80 font-lora">
          Don't have an account?{' '}
          <Link href="/auth/signup" className="text-gold hover:underline">
            Sign Up
          </Link>
        </p>
      </motion.div>
    </div>
  );
}