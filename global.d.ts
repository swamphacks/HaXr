import { Role, User } from '@prisma/client';

export declare module 'next-auth' {
  interface Session {
    user: User;
  }
}

export declare module '@forms/core/types' {
  interface Form2024 {
    firstName: string;
    lastName: string;
    email: string;
    phoneNumber: string;
    age: string;
    certAge: boolean;
    school: string;
    levelOfStudy: string;
    major: string;
    graduationMonth: string;
    graduationYear: string;
    hackathonExperience: string;
    teamStatus: string;
    tshirtSize: string;
    dietaryRestrictions: string[];
    referralSource: string[];
    photoConsent: boolean;
    inPersonConsent: boolean;
    codeOfConductConsent: boolean;
  }
}
