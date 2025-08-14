import prisma from "../../database/database";
import { getResponseAI } from "../../shared/generateCourse";

export const getAllTopicsService = async () => {
  // return await prisma.topic.findMany({
  //   orderBy: { name: "asc" },
  // });
};

export const createLearningPathService = async (
  // userId: string,
  topic: string,
  difficulty: string,
) => {
  const course = await getResponseAI(topic, difficulty);

  // STORING DATABASE BERDASARKAN USER_ID

  return course;

  // return await prisma.learningPath.upsert({
  //   where: {
  //     userId_topicId: {
  //       userId,
  //       topicId,
  //     },
  //   },
  //   update: {
  //     level,
  //     createdAt: new Date(),
  //   },
  //   create: {
  //     userId,
  //     topicId,
  //     level,
  //   },
  // });
};
