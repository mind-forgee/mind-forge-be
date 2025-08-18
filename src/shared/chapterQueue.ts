import Bull, { Job } from "bull";
import config from "../config/config";
import prisma from "../database/database";
import { chapterPrompt } from "./getPrompt";
import { textGeminiModel } from "./geminiAI";

type GeneratedChapterContentRequest = {
  chapterId: string;
};

const chapterQueue = new Bull("chapter", {
  redis: {
    port: config.redisPort,
    host: config.redisHost,
  },
  defaultJobOptions: {
    attempts: 3,
  },
});

export const generateChapterContent = async (
  chapter: GeneratedChapterContentRequest,
) => {
  console.log("Adding chapter to queue:", chapter);
  chapterQueue.add(chapter);
};

const processChapterQueue = async (
  job: Job<GeneratedChapterContentRequest>,
) => {
  console.log("Get job data", job.data);
  const { chapterId } = job.data;

  const chapter = await prisma.chapter.findUnique({
    where: {
      id: chapterId,
    },
    include: {
      course: {
        include: {
          topic: true,
        },
      },
    },
  });

  if (!chapter) {
    return Promise.reject(new Error(`Chapter with ID ${chapterId} not found`));
  }

  if (chapter.content) {
    console.log(`Chapter with ID ${chapterId} already has content, skipping.`);
    return Promise.resolve();
  }

  const prompt = chapterPrompt(
    chapter.course.title,
    chapter.course.description,
    chapter.title,
    chapter.description,
    chapter.order_index,
  );

  const responseModel = await textGeminiModel.generateContent({
    contents: [{ role: "user", parts: [{ text: prompt }] }],
    generationConfig: {
      responseMimeType: "text/plain",
    },
  });

  try {
    await prisma.chapter.update({
      where: { id: chapterId, content: null },
      data: {
        content: responseModel.response.text(),
        is_active: true,
      },
    });
  } catch (error: any) {
    return Promise.reject(
      new Error(error || "Failed to parse generated content"),
    );
  }

  return Promise.resolve();
};

chapterQueue.process(10, processChapterQueue);

chapterQueue.on("completed", (job) => {
  console.log(`Job ID ${job.id} completed`);
});

chapterQueue.on("failed", (job, err) => {
  console.error(`Job ID ${job.id} failed with error:`, err);
});
