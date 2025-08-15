import { number } from "zod";
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
  const course = await getContentOutline(topic, difficulty);

  const generatedCourse = await prisma.course.create({
    data: {
      user_id,
      course_name: course.course_name,
      description: course.description,
      difficulty: course.difficulty,
    },
  });

  queue.push(async () => {
    console.log("Queue Running!");
    try {
      const generatedChapters = await getContentChapters({
        course_name: generatedCourse.course_name,
        description: generatedCourse.description,
        difficulty: generatedCourse.difficulty,
      });

      await prisma.chapter.createMany({
        data: generatedChapters.chapters.map((ch: any, idx: number) => ({
          course_id: generatedCourse.id,
          chapter_name: ch.chapter_name,
          description: ch.description,
          content_json: ch.content_json,
          order_index: idx + 1,
        })),
      });

      console.log(`[Queue] Chapters saved for course ${generatedCourse.id}`);
    } catch (err) {
      console.error(
        `[Queue] Failed generating chapters for course ${generatedCourse.id}`,
        err,
      );
    }
  });
  return generatedCourse;
};

export const getChapterByCourseIdService = async (courseId: string) => {
  const chapter = await prisma.chapter.findMany({
    where: {
      course_id: Number(courseId),
    },
  });
  return chapter;
};
