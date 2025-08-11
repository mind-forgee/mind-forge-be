import prisma from "../database/database";
export const checkUser = async (email: string) => {
  const result = await prisma.user.findUnique({
    where: {
      email,
    },
  });
  return result;
};
