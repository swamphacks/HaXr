import GitHub, { GitHubProfile } from '@auth/core/providers/github';
import { NextAuthConfig } from 'next-auth';
import { Role, User } from '@prisma/client';

export default {
  providers: [
    GitHub({
      profile: ({ name, email, avatar_url, html_url }: GitHubProfile) => {
        let firstName = name ?? 'First Name',
          lastName = '';
        if (name && name.includes(' ')) [firstName, lastName] = name.split(' ');
        return {
          firstName,
          lastName,
          email,
          phone: null,
          school: null,
          image: avatar_url,
          role: Role.Hacker,
          bio: null,
          githubURL: html_url,
          linkedinURL: null,
          resumeUrl: null,
          skills: [],
        };
      },
      allowDangerousEmailAccountLinking: true,
    }),
  ],
  callbacks: {
    jwt({ token, user, session, trigger }) {
      if (trigger == 'update' && session?.user) token.user = session.user;

      if (user) token.user = user;

      return token;
    },
    async session({ session, token }) {
      session.user = token.user as User;
      return session;
    },
  },
} satisfies NextAuthConfig;
