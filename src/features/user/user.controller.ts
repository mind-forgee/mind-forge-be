import { NextFunction, Request, Response } from "express";
import {
  createUserService,
  getUserService,
  loginUserService,
  logoutUserService,
} from "./user.service";
import { createUserSchema, loginUserSchema } from "./user.schema";
import z from "zod";
import { AuthRequest } from "../../middleware/verifyToken";
import { APIResponse } from "../../models/response";

type InferBody<T extends z.ZodTypeAny> = z.infer<T>;

// user.controller.ts
export const createUser = async (
  req: Request<unknown, unknown, InferBody<typeof createUserSchema>>,
  res: Response<APIResponse>,
  next: NextFunction,
) => {
  const { full_name, email, password } = req.body as z.infer<
    typeof createUserSchema
  >;
  try {
    await createUserService(full_name, email, password);
    return res.status(200).json({
      message: "Sign Up Success!",
      status: "success",
    });
  } catch (err) {
    console.error("Error creating user:", err);
    next(err);
  }
};

export const loginUser = async (
  req: Request<unknown, unknown, InferBody<typeof loginUserSchema>>,
  res: Response<APIResponse>,
  next: NextFunction,
) => {
  const { email, password } = req.body as z.infer<typeof loginUserSchema>;
  try {
    const { full_name } = await loginUserService(email, password, res);

    return res.status(200).json({
      message: "Sign In Success",
      status: "success",
      data: {
        full_name,
        email,
      },
    });
  } catch (err) {
    next(err);
  }
};

export const getUser = async (
  req: AuthRequest,
  res: Response<APIResponse>,
  next: NextFunction,
) => {
  const userId = req.user?.user_id;

  try {
    const result = await getUserService(userId as string);
    return res.status(200).json({
      status: "success",
      message: "Get User Success",
      data: result,
    });
  } catch (err) {
    next(err);
  }
};

export const logoutUser = async (
  req: Request,
  res: Response<APIResponse>,
  next: NextFunction,
) => {
  try {
    await logoutUserService(res);
    return res.status(200).json({
      status: "success",
      message: "Log Out Success",
    });
  } catch (err) {
    next(err);
  }
};
