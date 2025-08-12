import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import config from "../config/config";

export type AuthRequest = Request & {
  user?: { user_id: string; iat?: number; exp?: number };
};

export const verifyToken = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
) => {
  const token = req.cookies?.token;
  if (!token) {
    throw new Error("Unauthorized");
  }

  try {
    const decoded = jwt.verify(token, config.jwtSecret);
    const { user_id, iat, exp } = decoded as jwt.JwtPayload;
    req.user = { user_id, iat, exp };
    next();
  } catch (err) {
    console.error(err);
    return res.status(401).json({ message: "Invalid token" });
  }
};
