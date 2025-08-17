import { CourseDifficulty } from "@prisma/client";
import prisma from "../../database/database";
import { outlinePrompt } from "../../shared/getPrompt";
import { textGeminiModel } from "../../shared/geminiAI";

type GeneratedChapterStructured = {
  title: string;
  description: string;
};

type GeneratedCourseStructured = {
  title: string;
  difficulty: CourseDifficulty;
  description: string;
  chapters: GeneratedChapterStructured[];
};

export const createCourseService = async (
  topicId: string,
  difficulty: CourseDifficulty,
  userId: string,
) => {
  const existingCourse = await prisma.course.findUnique({
    where: {
      topic_id_difficulty: {
        topic_id: topicId,
        difficulty: difficulty,
      },
    },
    include: {
      topic: true,
      chapters: {
        select: {
          id: true,
          title: true,
          description: true,
          order_index: true,
          is_active: true,
        },
        orderBy: { order_index: "asc" },
      },
    },
  });

  if (existingCourse) {
    return existingCourse;
  }

  const topic = await prisma.topic.findUnique({
    where: { id: topicId },
  });

  if (!topic) {
    throw new Error("Topic not found");
  }

  const prompt = outlinePrompt(topic.name, difficulty);

  const responseModel = await textGeminiModel.generateContent({
    contents: [{ role: "user", parts: [{ text: prompt }] }],
    generationConfig: {
      responseMimeType: "application/json",
    },
  });

  const generatedCourse: GeneratedCourseStructured = JSON.parse(
    responseModel.response.text(),
  );

  const generatedChapters = generatedCourse.chapters.map((chapter, idx) => ({
    order_index: idx + 1,
    title: chapter.title,
    description: chapter.description,
    is_active: false,
  }));

  const course = await prisma.course.create({
    data: {
      topic_id: topicId,
      title: generatedCourse.title,
      description: generatedCourse.description,
      difficulty: difficulty,
      generated_by: userId,
      chapters: {
        createMany: {
          data: generatedChapters,
        },
      },
    },
    include: {
      topic: true,
      chapters: {
        select: {
          id: true,
          title: true,
          description: true,
          order_index: true,
          is_active: true,
        },
        orderBy: { order_index: "asc" },
      },
    },
  });

  return course;
};
