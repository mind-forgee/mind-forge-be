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

    for (const chapter of existingCourse.chapters) {
      await prisma.chapterProgress.upsert({
        where: {
          user_id_chapter_id: {
            user_id: userId,
            chapter_id: chapter.id,
          },
        },
        create: {
          user_id: userId,
          chapter_id: chapter.id,
          is_done: false,
        },
        update: {
          user_id: userId,
          chapter_id: chapter.id,
          is_done: false,
        },
      });

      await generateChapterContent({
        chapterId: chapter.id,
      });
    }

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

  for (const chapter of course.chapters) {
    await prisma.chapterProgress.upsert({
      where: {
        user_id_chapter_id: {
          user_id: userId,
          chapter_id: chapter.id,
        },
      },
      create: {
        user_id: userId,
        chapter_id: chapter.id,
        is_done: false,
      },
      update: {
        user_id: userId,
        chapter_id: chapter.id,
        is_done: false,
      },
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
          chapters: {
            include: {
              progress: {
                where: {
                  user_id,
                },
                select: {
                  is_done: true,
                },
              },
              study_case_proofs: {
                where: {
                  user_id,
                },
                select: {
                  proof_url: true,
                  approved: true,
                },
              },
            },
          },
        },
      },
    },
  });

  if (!courseUser) {
    throw new APIError("Course User Not Found!", 404);
  }

  return courseUser;
};

export const updateStatusStudyCaseService = async (
  user_id: string,
  chapter_id: string,
  approved: boolean,
) => {
  const studyCase = await prisma.studyCaseProof.findUnique({
    where: {
      chapter_id_user_id: {
        chapter_id,
        user_id,
      },
    },
  });

  if (!studyCase) {
    throw new APIError("User has not submitted the study case!", 404);
  }

  const updatedProof = await prisma.studyCaseProof.update({
    where: {
      chapter_id_user_id: {
        chapter_id,
        user_id,
      },
    },
    data: {
      approved,
    },
  });

  return updatedProof;
};

export const collectStudyCaseProofService = async (
  user_id: string,
  chapter_id: string,
  proof_url: string,
) => {
  const chapter = await prisma.chapter.findUnique({
    where: { id: chapter_id, is_study_case: true },
  });

  if (!chapter) {
    throw new APIError("Chapter not found or not a study case", 404);
  }

  const submitProofLink = await prisma.studyCaseProof.upsert({
    where: {
      chapter_id_user_id: {
        chapter_id,
        user_id,
      },
    },
    create: {
      chapter_id,
      user_id,
      proof_url,
    },
    update: {
      proof_url,
    },
  });

  return submitProofLink;
};

export const getAllStudyCaseProofsService = async () => {
  return await prisma.studyCaseProof.findMany({
    include: {
      chapter: {
        select: {
          title: true,
          course: {
            select: {
              title: true,
              difficulty: true,
            },
          },
        },
      },
      user: {
        select: {
          full_name: true,
          email: true,
        },
      },
    },
  });
};

export const selectCompleteChapterService = async (
  user_id: string,
  chapter_id: string,
) => {
  const progressExists = await prisma.chapterProgress.findUnique({
    where: {
      user_id_chapter_id: {
        user_id,
        chapter_id,
      },
    },
  });

  if (!progressExists) {
    throw new APIError("Chapter progress not found", 404);
  }

  const completedChapter = await prisma.chapterProgress.update({
    where: {
      user_id_chapter_id: { user_id, chapter_id },
    },
    data: { is_done: true },
  });

  return completedChapter;
};

export const getAllCourseService = async () => {
  return await prisma.course.findMany();
};

export const deleteSelectedCourseService = async (course_id: string) => {
  return await prisma.course.delete({
    where: {
      id: course_id,
    },
  });
};
