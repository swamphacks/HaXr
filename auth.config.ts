import GitHub, { GitHubProfile } from '@auth/core/providers/github';
import { NextAuthConfig } from 'next-auth';
import { Role, User } from '@prisma/client';

export default {
  providers: [
    GitHub({
      profile: ({ name, email, avatar_url }: GitHubProfile) => {
        const [firstName, lastName] = name?.split(' ') ?? ['', ''];
        return {
          firstName,
          lastName,
          email,
          phone: null,
          school: null,
          image: avatar_url,
          role: Role.Hacker,
          isOnboarded: false,
        };
      },
      allowDangerousEmailAccountLinking: true,
    }),
  ],
  callbacks: {
    jwt({ token, user, session, trigger }) {
      if (trigger == 'update' && session?.user) {
        token.user = session.user;
      }

      if (user) {
        token.user = user;
      }
      return token;
    },
    async session({ session, token }) {
      session.user = token.user as User;
      return session;
    },
  },
} satisfies NextAuthConfig;
