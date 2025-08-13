import { z } from "zod";

export const createTopicSchema = z
  .object({
    name: z
      .string()
      .min(1, { message: "Topic name is required" })
      .trim(),
    description: z
      .string()
      .optional()
      .nullable()
      .transform((val) => val || null),
  })
  .strip()
  .describe("createTopicSchema");
