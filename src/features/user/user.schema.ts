import { email, toLowerCase, z } from "zod";

export const createUserSchema = z.object({
  full_name: z
    .string({ error: "Name is required" })
    .min(3, { message: "Name must be at least 3 characters long" })
    .trim(),

  email: z
    .string({ error: "Email is required" })
    .min(1, { message: "Email is required" })
    .email({ message: "Invalid email format" })
    .toLowerCase()
    .trim(),

  password: z
    .string({ error: "Password is required" })
    .min(6, { message: "Password must be at least 6 characters long" }),
});

export const loginUserSchema = z.object({
  password: z
    .string({ error: "Password is required" })
    .min(3, { message: "Passowrd must be at lesast 6 characters long" }),

  email: z
    .string({ error: "Email is required" })
    .min(1, { message: "Email is required" })
    .email({ message: "Failed email format" })
    .toLowerCase()
    .trim(),
});
