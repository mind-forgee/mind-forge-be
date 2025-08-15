import z from "zod";
import prisma from "../../database/database";
import { saveLearningPathSchema } from "./learningPath.schema";

export const getAllTopicsService = async () => {
  return await prisma.topic.findMany({
    orderBy: { name: "asc" },
  });
};

export const saveUserLearningPathService = async (
  topicId: string,
  level: z.infer<typeof saveLearningPathSchema>["level"],
) => {
  return await prisma.learningPath.upsert({
    where: {
      topicId: topicId,
    },
    update: {
      level,
      createdAt: new Date(),
    },
    create: {
      topicId,
      level,
    },
  });
};
