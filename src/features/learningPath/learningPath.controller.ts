import { Router, Response, NextFunction } from "express";
import { AuthRequest } from "../../middleware/verifyToken";
import {
  getAllTopicsService,
  saveUserLearningPathService,
} from "./learningPath.service";
import { APIResponse } from "../../models/response";
import { saveLearningPathSchema } from "./learningPath.schema";
import z from "zod";

const router = Router();

// GET /api/learning-path/topics - fetch all available topics
export const getAllTopicsController = async (
  req: AuthRequest,
  res: Response<APIResponse>,
  next: NextFunction,
) => {
  try {
    const topics = await getAllTopicsService();
    res.status(200).json({
      status: "success",
      message: "Topics fetched successfully",
      data: topics,
    });
  } catch (err) {
    next(err);
  }
};

// POST /api/learning-path - save user's chosen topic and level
export const saveLearningPathController = async (
  req: AuthRequest,
  res: Response<APIResponse>,
  next: NextFunction,
) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        status: "error",
        message: "Unauthorized",
      });
    }

    const { topic_id, level } = req.body as z.infer<
      typeof saveLearningPathSchema
    >;

    const saved = await saveUserLearningPathService(topic_id, level);

    res.status(201).json({
      status: "success",
      message: "Learning path saved successfully",
      data: saved,
    });
  } catch (err) {
    next(err);
  }
};

export default router;
