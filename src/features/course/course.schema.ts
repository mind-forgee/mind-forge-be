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

export const deleteCourseSchema = z.object({
  course_id: z
    .string({ message: "Course Id Is required" })
    .min(4, { message: "Course id minimal 4 letters" }),
});

export const collectStudyCaseProofSchema = z.object({
  proof_url: z
    .url({
      message: "Proof URL must be a valid URL",
    })
    .min(1, {
      message: "Proof URL is required",
    }),
});
