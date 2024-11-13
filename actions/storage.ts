'use server';
import { put } from '@vercel/blob';
import { revalidatePath } from 'next/cache';

export const uploadResume = async (
  formData: FormData,
  firstName: string,
  lastName: string
) => {
  const resume = formData.get('file') as File;
  const blob = await put(`${firstName}${lastName}_resume`, resume, {
    access: 'public',
  });
  revalidatePath('/');
  return blob;
};
