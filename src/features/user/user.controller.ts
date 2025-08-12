import dotenv from "dotenv";
import { NextFunction, Request, Response } from "express";
import {
  createUserService,
  loginUserService,
  logoutUserService,
} from "./user.service";
import { createUserSchema, loginUserSchema } from "./user.schema";
import z from "zod";

dotenv.config();
type InferBody<T extends z.ZodTypeAny> = z.infer<T>;

// user.controller.ts
export const createUser = async (
  req: Request<unknown, unknown, InferBody<typeof createUserSchema>>,
  res: Response,
  next: NextFunction,
) => {
  const { full_name, email, password } = req.body as z.infer<
    typeof createUserSchema
  >;
  try {
    const result = await createUserService(full_name, email, password);
    return res.status(200).json({ message: "Sign Up Success!" });
  } catch (err) {
    next(err);
  }
};

export const loginUser = async (
  req: Request<unknown, unknown, InferBody<typeof loginUserSchema>>,
  res: Response,
  next: NextFunction,
) => {
  const { email, password } = req.body as z.infer<typeof loginUserSchema>;
  try {
    const result = await loginUserService(email, password, res);
    return res.status(200).json({ message: "Sign In Success", data: result });
  } catch (err) {
    next(err);
  }
};

export const logoutUser = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const result = await logoutUserService(res);
    return res.status(200).json({ message: "Log Out Success" });
  } catch (err) {
    next(err);
  }
};
