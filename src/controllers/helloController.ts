import { Request, Response } from "express";

export const getHello = (req: Request, res: Response) => {
  res.status(201).json({
    message: "Hello, World!",
    timestamp: new Date().toISOString(),
  });
};
