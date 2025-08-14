import { AuthRequest } from './verifyToken';
import { Response, NextFunction } from 'express';
import { APIError } from "./erorrHandler";

export const isAdmin = (req: AuthRequest, res: Response, next: NextFunction) => {
  if (req.user?.role === 'admin') {
    return next();
  }
  throw new APIError('Forbidden: Admins only', 403);
};
