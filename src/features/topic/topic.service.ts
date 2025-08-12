// src/features/topic/topic.service.ts
import prisma from "../../database/database";
import { APIError } from "../../middleware/erorrHandler";

export const createTopicService = async (
  name: string,
  description: string | null,
  createdBy: string,
) => {
  const existing = await prisma.topic.findUnique({ where: { name } });
  if (existing) {
    throw new APIError("Topic already exists", 400);
  }

  const topic = await prisma.topic.create({
    data: {
      name,
      description,
      createdBy,
    },
  });

  return topic;
};
