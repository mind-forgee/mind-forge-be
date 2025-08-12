import { z } from "zod";

export const createUserSchema = z.object({
  full_name: z.string({ error: "Full name is required" })
    .min(3, { message: "Full name must be at least 3 characters" })
    .trim(),
  email: z.string({ error: "Email is required" })
    .email({ message: "Invalid email format" })
    .toLowerCase()
    .trim(),
  password: z.string({ error: "Password is required" })
    .min(6, { message: "Password must be at least 6 characters" }),
})
.strip()                  // kunci asing dibuang
.describe("createUserSchema");

export const loginUserSchema = z.object({
  email: z.string({ error: "Email is required" })
    .email({ message: "Invalid email format" })
    .toLowerCase()
    .trim(),
  password: z.string({ error: "Password is required" })
    .min(6, { message: "Password must be at least 6 characters" }),
})
.strip()                  // kalau ada full_name ikut terkirim, akan dihapus
.describe("loginUserSchema");
