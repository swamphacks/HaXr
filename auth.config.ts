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
        };
      },
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
      // session.user.firstName = token.firstName as string;
      // session.user.lastName = token.lastName as string;
      // session.user.phone = token.phone as string | null;
      // session.user.school = token.school as string | null;
      // session.user.role = token.role as Role;

      session.user = token.user as User;
      return session;
    },
  },
} satisfies NextAuthConfig;
