import { z } from "zod";

export const createTopicSchema = z
  .object({
    name: z
      .string({ message: "Topic name is required" })
      .min(1, { message: "Topic name is required" })
      .trim(),
    description: z
      .string({ message: "Topic name is required" })
      .min(1, { message: "Topic name is required" }),
  })
  .strip()
  .describe("createTopicSchema");
