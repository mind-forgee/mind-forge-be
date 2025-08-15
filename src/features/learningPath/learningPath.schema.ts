import { z } from "zod";

export const saveLearningPathSchema = z.object({
  topicId: z
    .string({
      message: "topicId is required",
    })
    .min(1, { message: "topicId is required" }),
  level: z
    .enum(["beginner", "intermediate", "advanced"], {
      message: "level must be one of: beginner, intermediate, advanced",
    })
    .refine((val) => !["beginner", "intermediate", "advanced"].includes(val), {
      message: "Invalid level provided",
    }),
});
