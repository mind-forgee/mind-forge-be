import { z } from "zod";

export const saveLearningPathSchema = z.object({
  topicId: z.string().min(1, { message: "topicId is required" }),
  level: z.string().min(1, { message: "level is required" }),
});

export type SaveLearningPathInput = z.infer<typeof saveLearningPathSchema>;
