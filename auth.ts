import NextAuth from 'next-auth';
import GitHub from 'next-auth/providers/github';
import { PrismaClient } from '@prisma/client';
import { PrismaAdapter } from '@auth/prisma-adapter';
import { Pool } from '@neondatabase/serverless';
import { PrismaNeon } from '@prisma/adapter-neon';

const neon = new Pool({
  connectionString: process.env.POSTGRES_PRISMA_URL,
});
const adapter = new PrismaNeon(neon);
const prisma = new PrismaClient({ adapter });

export const { handlers, auth, signOut } = NextAuth({
  adapter: PrismaAdapter(prisma),
  providers: [GitHub],
  callbacks: {
    session({ session, user }) {
      session.user.role = user.role; // Add user's role to session
      return session;
    },
  },
});
