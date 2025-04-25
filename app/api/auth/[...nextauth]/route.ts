// /app/api/auth/[...nextauth]/route.ts
import NextAuth, { AuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { auth, db } from '@/lib/firebase/firebase';

export const authOptions: AuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'Email and Password',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        console.log('Authorize: Starting with credentials:', {
          email: credentials?.email,
          hasPassword: !!credentials?.password,
        });
        if (!credentials?.email || !credentials?.password) {
          console.error('Authorize: Missing credentials');
          throw new Error('Missing credentials');
        }
        try {
          console.log('Authorize: Attempting Firebase sign-in');
          const userCredential = await signInWithEmailAndPassword(
            auth,
            credentials.email,
            credentials.password
          );
          const user = userCredential.user;
          console.log('Authorize: Firebase sign-in successful, UID:', user.uid);

          console.log('Authorize: Fetching user document from Firestore');
          const userDoc = await getDoc(doc(db, 'users', user.uid));
          if (!userDoc.exists()) {
            console.error('Authorize: User document not found in Firestore, UID:', user.uid);
            throw new Error('User not found in database');
          }
          const userData = userDoc.data();
          console.log('Authorize: User document fetched:', userData);

          return {
            id: user.uid,
            email: user.email,
            name: user.displayName,
            role: userData.role || 'user',
          };
        } catch (error: any) {
          console.error('Authorize: Error:', {
            message: error.message,
            code: error.code,
            stack: error.stack,
          });
          throw new Error('Invalid email or password');
        }
      },
    }),
  ],
  session: {
    strategy: 'jwt',
  },
  callbacks: {
    async jwt({ token, user }) {
      console.log('JWT Callback: Input:', { token, user });
      if (user) {
        token.id = user.id;
        token.role = user.role;
      }
      console.log('JWT Callback: Output token:', token);
      return token;
    },
    async session({ session, token }) {
      console.log('Session Callback: Input:', { session, token });
      if (token) {
        session.user.id = token.id;
        session.user.role = token.role;
      }
      console.log('Session Callback: Output session:', session);
      return session;
    },
  },
  pages: {
    signIn: '/auth/signin',
    error: '/auth/error',
  },
  debug: true,
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };