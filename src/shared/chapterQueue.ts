import Bull, { Job } from "bull";
import config from "../config/config";
import prisma from "../database/database";
import { chapterPrompt } from "./getPrompt";
import { textGeminiModel } from "./geminiAI";

type GeneratedChapterContentRequest = {
  chapterId: string;
};

type GeneratedChapterContentResponse = {
  content: string[];
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
    throw new Error("Chapter not found");
  }

  const prompt = chapterPrompt(
    chapter.course.title,
    chapter.course.description,
    chapter.title,
    chapter.description,
  );

  const responseModel = await textGeminiModel.generateContent({
    contents: [{ role: "user", parts: [{ text: prompt }] }],
    generationConfig: {
      responseMimeType: "application/json",
    },
  });

  const generatedCourse: GeneratedChapterContentResponse = JSON.parse(
    responseModel.response.text(),
  );

  await prisma.chapter.update({
    where: { id: chapterId },
    data: { content_json: generatedCourse.content },
  });

  return Promise.resolve();
};

chapterQueue.process(10, processChapterQueue);

chapterQueue.on("completed", (job: any) => {
  console.log(`Job ID ${job.id} completed with result`);
});

chapterQueue.on("failed", (job: any, err: any) => {
  console.error(`Job ID ${job.id} failed with error:`, err);
});
