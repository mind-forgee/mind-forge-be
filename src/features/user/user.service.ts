import prisma from "../../database/database";
import bcrypt from "bcrypt";
import { generateToken } from "../../shared/generateToken";
import { Response } from "express";
import { checkUser } from "../../shared/checkUser";
import { setAuthCookie } from "../../shared/setAuthCookie";
import { clearAuthCookie } from "../../shared/clearAuthCookie";
import { APIError } from "../../middleware/erorrHandler";

export const createUserService = async (
  full_name: string,
  email: string,
  password: string,
) => {
  const existingUser = await checkUser(email);

  if (existingUser) {
    throw new APIError("User email already exist", 400);
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const result = await prisma.user.create({
    data: {
      full_name,
      email,
      password: hashedPassword,
    },
  });

  return result;
};

export const loginUserService = async (
  email: string,
  password: string,
  res: Response,
) => {
  const user = await checkUser(email);
  if (!user) {
    throw new APIError("Invalid Credentials!", 400);
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    throw new APIError("Invalid Credentials!");
  }

  const token = generateToken({ user_id: user.id, role: user.role });
  setAuthCookie(token, res);

  const { full_name, selected_course } = user;
  return {
    full_name,
    selected_course,
  };
};

export const getUserService = async (user_id: string) => {
  const user = await prisma.user.findFirst({
    where: {
      id: user_id,
    },
    select: {
      id: true,
      full_name: true,
      email: true,
      role: true,
      selected_course: {
        select: {
          course_id: true,
        },
      },
      created_at: true,
      updated_at: true,
    },
  });

  if (!user) {
    throw new APIError("User not found", 404);
  }

  return {
    user,
  };
};

export const logoutUserService = async (res: Response) => {
  clearAuthCookie(res);
};
