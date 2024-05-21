'use server';
import { signOut } from '@/auth';

export const serverSignOut = async () => await signOut();
