// app/api/auth/[...nextauth]/route.ts
import NextAuth from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import { AuthOptions } from 'next-auth';
import { doc, setDoc } from 'firebase/firestore';
import { adminAuth } from '@/lib/firebase/admin';
import { db } from '@/lib/firebase/firebase';

export const authOptions: AuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  session: {
    strategy: 'jwt',
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        try {
          const firebaseToken = await adminAuth.verifyIdToken(user.id);
          token.role = firebaseToken.role || 'guest';
        } catch (error) {
          console.error('Error verifying Firebase token:', error);
          token.role = 'guest';
          // Set default role for new users
          await adminAuth.setCustomUserClaims(user.id, { role: 'guest' });
          // Store user data in Firestore
          await setDoc(doc(db, 'users', user.id), {
            id: user.id,
            email: user.email || '',
            name: user.name || '',
            role: 'guest',
            createdAt: new Date().toISOString(),
          }, { merge: true });
        }
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user = {
          id: token.id as string,
          role: token.role as string,
          name: session.user?.name || null,
          email: session.user?.email || null,
          image: session.user?.image || null,
        };
      }
      return session;
    },
  },
  pages: {
    signIn: '/auth/signin',
    newUser: '/auth/signup',
  },
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };