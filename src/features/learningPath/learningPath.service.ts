import prisma from "../../database/database";

export const getAllTopicsService = async () => {
  return await prisma.topic.findMany({
    orderBy: { name: 'asc' },
  });
};

export const saveUserLearningPathService = async (
  userId: string,
  topicId: string,
  level: string
) => {
  return await prisma.learningPath.upsert({
    where: {
      userId_topicId: {
        userId,
        topicId,
      },
    },
    update: {
      level,
      createdAt: new Date(),
    },
    create: {
      userId,
      topicId,
      level,
    },
  });
};
