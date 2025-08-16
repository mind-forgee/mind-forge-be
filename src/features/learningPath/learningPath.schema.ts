import { z } from "zod";

export const saveLearningPathSchema = z.object({
  topic_id: z
    .string({
      message: "topic_id is required",
    })
    .min(1, { message: "topic_id is required" }),
  level: z
    .enum(["beginner", "intermediate", "advanced"], {
      message: "level must be one of: beginner, intermediate, advanced",
    })
    .refine((val) => ["beginner", "intermediate", "advanced"].includes(val), {
      message: "level must be one of: beginner, intermediate, advanced",
    }),
});
