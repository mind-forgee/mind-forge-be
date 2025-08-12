import prisma from "../../database/database";
import bcrypt from "bcrypt";
import { generateToken } from "../../shared/generateToken";
import { Response } from "express";
import { checkUser } from "../../shared/checkUser";
import { setAuthCookie } from "../../shared/setAuthCookie";
import { clearAuthCookie } from "../../shared/clearAuthCookie";

export const createUserService = async (
  full_name: string,
  email: string,
  password: string,
) => {
  const existingUser = await checkUser(email);

  if (existingUser) {
    throw new Error("User email already exist");
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
    throw new Error("Invalid Credentials!");
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    throw new Error("Invalid Credentials!");
  }

  const token = generateToken({ user_id: user.id });
  setAuthCookie(token, res);
  return token;
};

export const getUserService = async (user_id: string) => {
  const existingUser = await prisma.user.findFirst({
    where: {
      id: user_id,
    },
    select: {
      full_name: true,
      email: true,
    },
  });

  return existingUser;
};

export const logoutUserService = async (res: Response) => {
  clearAuthCookie(res);
};
