import { Role } from '@prisma/client';

declare module 'next-auth' {
  interface Session {
    id: string;
    role: Role;
  }

  interface User {
    id: string;
    role: Role;
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    id: string;
    role: Role;
  }
}
