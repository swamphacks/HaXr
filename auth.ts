import NextAuth, { NextAuthConfig } from 'next-auth';
import GitHub from '@auth/core/providers/github';

export const config = {
  providers: [GitHub],
  theme: {
    colorScheme: 'dark',
    logo: '/swamphacks_hd.png',
  },
} satisfies NextAuthConfig;

export const { handlers, signIn, signOut, auth } = NextAuth(config);
