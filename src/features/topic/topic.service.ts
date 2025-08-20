import prisma from "../../database/database";
import { APIError } from "../../middleware/erorrHandler";

export const getAllTopicsService = async () => {
  return await prisma.topic.findMany({
    orderBy: { name: "asc" },
  });
};

export const createTopicService = async (name: string, description: string) => {
  const existing = await prisma.topic.findUnique({ where: { name } });
  if (existing) {
    throw new APIError("Topic already exists", 400);
  }

  return await prisma.topic.create({
    data: {
      name,
      description,
    },
  });
};

export const deleteTopicService = async (topic_id: string) => {
  return await prisma.topic.delete({
    where: {
      id: topic_id,
    },
  });
};
