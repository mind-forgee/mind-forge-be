import dotenv from "dotenv";
import { NextFunction, Request, Response } from "express";
import {
  createUserService,
  loginUserService,
  logoutUserService,
} from "./user.service";

dotenv.config();

export const createUser = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const { full_name, email, password } = req.body;
  try {
    const result = await createUserService(full_name, email, password);
    return res.status(200).json({ message: "Sign Up Success!" });
  } catch (err) {
    console.log(err);
    next(err);
  }
};

export const loginUser = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const { email, password } = req.body;
  try {
    const result = await loginUserService(email, password, res);
    return res.status(200).json({ message: "Sign In Success" });
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
