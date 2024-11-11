'use server';
import { auth, signOut } from '@/auth';

export const serverSignOut = async () => await signOut();

export const getAuth = async () => {
  const res = await auth();
  return res;
};
