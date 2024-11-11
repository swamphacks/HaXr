export const updateUserResume = async (userId: string, resumeUrl: string) => {
  return await prisma.user.update({
    where: {
      id: userId,
    },
    data: {
      resumeUrl,
    },
  });
};
