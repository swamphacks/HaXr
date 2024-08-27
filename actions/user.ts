'use server';

import prisma from '@/prisma';
import { type User } from '@prisma/client';
import { del, put } from '@vercel/blob';

const updateUserProfile = async (
  user_id: string,
  user: User
): Promise<User | null> => {
  try {
    return prisma.user.update({
      where: {
        id: user_id,
      },
      data: { ...user },
    });
  } catch {
    return null;
  }
};

/* 
Order of Operation:
1. Upload the old avatar to the blob storage
2. Delete the old avatar from the blob storage
3. Update the user's avatar in the database
*/
const updateUserAvatar = async (
  user_id: string,
  formData: FormData
): Promise<User | null> => {
  try {
    const avatar_image = formData.get('file') as File;
    const blob = await put(avatar_image.name, avatar_image, {
      access: 'public',
    });

    if (!blob.url) throw new Error('Missing url');

    await deleteUserAvatar(user_id);

    return prisma.user.update({
      where: {
        id: user_id,
      },
      data: {
        image: blob.url,
      },
    });
  } catch (e) {
    console.log(e);
    return null;
  }
};

const deleteUserAvatar = async (user_id: string): Promise<null | undefined> => {
  const user = await prisma.user.findUnique({
    where: {
      id: user_id,
    },
  });

  if (!user?.image) {
    return null;
  }

  try {
    await del(user.image);
  } catch {
    console.error(`Could not delete avatar for userID: ${user.id}`);
  }
};

export { updateUserProfile, updateUserAvatar, deleteUserAvatar };
