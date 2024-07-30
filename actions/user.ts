'use server';

import prisma from '@/prisma';
import { type User } from '@prisma/client';
import { del } from '@vercel/blob'

const updateUserProfile = async (user_id: string, user: User) => {
  try {
    const new_user = await prisma.user.update({
      where: {
        id: user_id
      },
      data: { ...user },
    });

    return new_user;
  } catch {
    return null;
  }
};

const updateUserAvatar = async (user_id: string, user_avatar_url: string) => {
  try {
    if (!user_avatar_url) throw new Error("Missing url");
    const new_user = await prisma.user.update({
      where: {
        id: user_id
      },
      data: {
        image: user_avatar_url
      }
    })

    return new_user;
  } catch {
    return null;
  }
}

const deleteUserAvatar = async (user_id: string) => {
  const user = await prisma.user.findUnique({
    where: {
      id: user_id
    }
  })

  if (!user?.image) {
    return
  }

  try {
    await del(user.image);
  } catch {
    console.log("Could not delete");
  }
}

export { updateUserProfile, updateUserAvatar, deleteUserAvatar };
