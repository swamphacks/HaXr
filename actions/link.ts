'use server';
import prisma from '@/prisma';

/**
 *
 * @param userId ID of the user to link
 * @param discordId Snowflake ID of the discord account to link
 * @returns User object with updated discordId
 */
export const linkDiscord = async (userId: string, discordId: string) => {
  try {
    return await prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        discordId,
      },
    });
  } catch (error) {
    console.error('Error linking Discord account:', error);
    throw error;
  }
};
