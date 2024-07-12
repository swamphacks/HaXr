'use server';

import prisma from '@/prisma';
import { type User } from '@prisma/client';

const updateUserProfile = async (user_id: string, user: User) => {
  // Check validity here TODO
  try {
    const new_user = await prisma.user.update({
      where: {
        id: user_id,
      },
      data: { ...user },
    });

    return new_user;
  } catch {
    return null;
  }
};

export { updateUserProfile };
