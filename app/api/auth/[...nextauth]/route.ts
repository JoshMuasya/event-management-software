import NextAuth, { NextAuthOptions, Session, User } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';

// Extend the User type to include custom properties
declare module 'next-auth' {
  interface User {
    id: string;
    email?: string | null;
    role: string;
  }

  interface Session {
    user: {
      id: string;
      email?: string | null;
      role: string;
    };
  }
}

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'text' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (credentials?.email && credentials?.password) {
          return { id: '1', email: credentials.email, role: 'organizer' };
        }
        return null;
      },
    }),
  ],
  callbacks: {
    async session({ session, user }: { session: Session; user: User }) {
      if (session.user && user) {
        session.user.id = user.id;
        session.user.role = user.role || 'guest';
      }
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };