import GitHub, { GitHubProfile } from '@auth/core/providers/github';
import { NextAuthConfig } from 'next-auth';
import { Role } from '@prisma/client';
import prisma from '@/prisma';

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
    jwt({ token, user }) {
      if (user) {
        // User is available during sign-in
        token.id = user.id;
      }
      return token;
    },
    async session({ session, token }) {
      const user = await prisma.user.findUnique({
        where: { id: token.id as string },
      });
      if (user) {
        session.user.firstName = user.firstName;
        session.user.lastName = user.lastName;
        session.user.phone = user.phone;
        session.user.school = user.school;
        session.user.role = user.role;
      }
      return session;
    },
  },
} satisfies NextAuthConfig;
