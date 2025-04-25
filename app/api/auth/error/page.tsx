'use client';
import { useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';
import Link from 'next/link';

export default function AuthError() {
  const searchParams = useSearchParams();
  const error = searchParams.get('error');

  const errorMessages: { [key: string]: string } = {
    CredentialsSignin: 'Invalid email or password. Please try again.',
    default: 'An error occurred during authentication. Please try again later.',
  };

  const message = error ? errorMessages[error] || errorMessages.default : errorMessages.default;

  return (
    <div className="min-h-screen flex items-center justify-center bg-dark">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-dark/80 backdrop-blur-md p-8 rounded-lg shadow-lg w-full max-w-md border border-champagne-gold/30"
      >
        <h1 className="text-3xl font-playfair font-bold mb-6 text-center text-gold">Authentication Error</h1>
        <p className="text-red-400 mb-6 text-center font-lora">{message}</p>
        <p className="text-light mb-6 text-center font-lora">
          Return to sign-in to try again.
        </p>
        <Link
          href="/auth/signin"
          className="block text-center bg-gold text-dark p-3 rounded-md font-lora font-medium hover:bg-champagne-gold transition-colors"
        >
          Back to Sign In
        </Link>
      </motion.div>
    </div>
  );
}