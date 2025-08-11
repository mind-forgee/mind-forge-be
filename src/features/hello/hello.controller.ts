import { Request, Response } from "express";
import { getHelloMessage } from "./hello.service";

export const getHello = (req: Request, res: Response) => {
  const message = getHelloMessage("World");

  res.status(201).json({
    message,
    timestamp: new Date().toISOString(),
  });
};
