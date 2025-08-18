import { CourseDifficulty } from "@prisma/client";
import z from "zod";

export const createCourseSchema = z.object({
  topic_id: z.string().min(1, { message: "Topic id is required" }),
  difficulty: z.enum(
    [
      CourseDifficulty.beginner,
      CourseDifficulty.intermediate,
      CourseDifficulty.advanced,
    ],
    {
      message:
        "Difficulty must be one of the following: beginner, intermediate, advanced",
    },
  ),
});
