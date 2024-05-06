import GitHub from '@auth/core/providers/github';
import { NextAuthConfig } from 'next-auth';

export default {
  providers: [GitHub],
  callbacks: {
    // authorized({ request, auth }) {
    //   const { pathname } = request.nextUrl
    //   if (pathname === "/middleware-example") return !!auth
    //   return true
    // },
    // jwt({ token, trigger, session }) {
    //   if (trigger === 'update') token.name = session?.user?.name;
    //   return token;
    // },
    jwt({ token, user }) {
      if (user) {
        // User is available during sign-in
        token.isAdmin = user.isAdmin;
      }
      return token;
    },
    session({ session, token }) {
      session.user.isAdmin = token.isAdmin as boolean;
      return session;
    },
  },
} satisfies NextAuthConfig;
