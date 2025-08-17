import prisma from "../../database/database";
import {
  getContentChapters,
  getContentOutline,
} from "../../shared/generateCourse";
import { queue } from "../../shared/imMemoryQueue";

export const getAllTopicsService = async () => {
  // return await prisma.topic.findMany({
  //   orderBy: { name: "asc" },
  // });
};

export const createLearningPathService = async (
  user_id: string,
  topic: string,
  difficulty: string,
) => {
  const course_key = `${topic.toLowerCase()} ${difficulty.toLowerCase()}`;

  const existingCourse = await prisma.course.findFirst({
    where: {
      course_key: { equals: course_key, mode: "insensitive" },
      difficulty: { equals: difficulty, mode: "insensitive" },
    },
    include: { chapter: { orderBy: { order_index: "asc" } } },
  });

  if (existingCourse) {
    return existingCourse;
  }

  const updateUser = await prisma.user.update({
    where: {
      id: user_id,
    },
    data: {
      selected_course_key: course_key,
    },
  });

  try {
    const outline = await getContentOutline(topic, difficulty);

    const generatedCourse = await prisma.course.create({
      data: {
        course_name: outline.course_name,
        description: outline.description,
        difficulty: outline.difficulty,
        course_key,
      },
    });

    queue.push(async () => {
      console.log("[Queue] Generating chapters…");
      try {
        const generatedChapters = await getContentChapters({
          course_name: generatedCourse.course_name,
          description: generatedCourse.description,
          difficulty: generatedCourse.difficulty,
        });

        // Validasi ringan & mapping aman
        const rows = Array.isArray(generatedChapters?.chapters)
          ? generatedChapters.chapters.map((ch: any, idx: number) => ({
              course_id: generatedCourse.id,
              chapter_name: String(ch.chapter_name),
              description: String(ch.description),
              content_json: ch.content_json,
              order_index: idx + 1,
            }))
          : [];

        if (!rows.length) {
          console.warn(
            `[Queue] No chapters returned for course ${generatedCourse.id}`,
          );
          return;
        }

        await prisma.chapter.createMany({ data: rows });
        console.log(`[Queue] Chapters saved for course ${generatedCourse.id}`);
      } catch (err) {
        console.error(
          `[Queue] Failed generating chapters for course ${generatedCourse.id}`,
          err,
        );
      }
    });

    return generatedCourse;
  } catch (err) {
    throw new Error("Gagal membuat course");
  }
};

export const getChapterByCourseIdService = async (courseId: string) => {
  const chapter = await prisma.chapter.findMany({
    where: {
      course_id: Number(courseId),
    },
  });
  return chapter;
};
