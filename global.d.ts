import { Role } from '@prisma/client';

export declare module '@auth/core/types' {
  interface User {
    firstName: string;
    lastName: string;
    phone: string | null;
    school: string | null;
    role: Role;
    bio: string | null;
    githubURL: string | null;
    linkedinURL: string | null;
    skills: string[];
    resumeUrl: string | null;
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
