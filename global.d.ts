import { Role } from '@prisma/client';

export declare module '@auth/core/types' {
  interface User {
    firstName: string;
    lastName: string;
    phone: string | null;
    school: string | null;
    role: Role;
    isOnboarded: boolean;
  }
}
