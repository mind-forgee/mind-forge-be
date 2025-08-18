import { CourseDifficulty } from "@prisma/client";
import prisma from "../../database/database";
import { outlinePrompt } from "../../shared/getPrompt";
import { textGeminiModel } from "../../shared/geminiAI";
import { generateChapterContent } from "../../shared/chapterQueue";
import { APIError } from "../../middleware/erorrHandler";

type GeneratedChapterStructured = {
  title: string;
  description: string;
  is_study_case: boolean;
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
          is_study_case: true,
        },
        orderBy: { order_index: "asc" },
      },
    },
  });

  if (existingCourse) {
    await prisma.selectedCourse.upsert({
      where: {
        user_id: userId,
      },
      create: {
        user_id: userId,
        course_id: existingCourse.id,
      },
      update: {
        user_id: userId,
        course_id: existingCourse.id,
      },
    });

    return existingCourse;
  }

  const topic = await prisma.topic.findUnique({
    where: { id: topicId },
  });

  if (!topic) {
    throw new APIError("Topic not found", 404);
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
    is_study_case: chapter.is_study_case ?? false,
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
          is_study_case: true,
        },
        orderBy: { order_index: "asc" },
      },
    },
  });

  await prisma.selectedCourse.upsert({
    where: {
      user_id: userId,
    },
    create: {
      user_id: userId,
      course_id: course.id,
    },
    update: {
      user_id: userId,
      course_id: course.id,
    },
  });

  for (const chapter of course.chapters) {
    // Adding to queue for chapter content generation worker
    await generateChapterContent({
      chapterId: chapter.id,
    });
  }

  return course;
};

export const getUserCourseService = async (user_id: string) => {
  const courseUser = await prisma.selectedCourse.findUnique({
    where: {
      user_id,
    },
    include: {
      course: {
        include: {
          chapters: true,
        },
      },
    },
  });

  return courseUser;
};
