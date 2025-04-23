'use client';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { motion } from 'framer-motion';

export default function SignUp() {
  const [error, setError] = useState('');
  const router = useRouter();

  const handleGoogleSignUp = async () => {
    try {
      const result = await signIn('google', { redirect: false, callbackUrl: '/dashboard' });
      if (result?.error) {
        setError('Failed to sign up with Google');
      } else {
        router.push('/dashboard');
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
        <h1 className="text-3xl font-playfair font-bold mb-6 text-center text-gold">Sign Up</h1>
        {error && <p className="text-red-400 mb-4 text-center font-lora">{error}</p>}
        <p className="text-light mb-6 text-center font-lora">
          Create an account to manage events and access the admin dashboard.
        </p>
        <motion.button
          whileHover={{ scale: 1.05, backgroundColor: '#E6C200' }}
          whileTap={{ scale: 0.95 }}
          onClick={handleGoogleSignUp}
          className="w-full bg-gold text-dark p-3 rounded-md font-lora font-medium hover:bg-champagne-gold transition-colors"
        >
          Sign Up with Google
        </motion.button>
        <p className="mt-4 text-center text-light/80 font-lora">
          Already have an account?{' '}
          <a href="/auth/signin" className="text-gold hover:underline">
            Sign In
          </a>
        </p>
      </motion.div>
    </div>
  );
}