import { Router, Response, NextFunction } from "express";
import { AuthRequest } from "../../middleware/verifyToken";
import {
  getAllTopicsService,
  createLearningPathService,
} from "./learningPath.service";
import { APIResponse } from "../../models/response";

const router = Router();

export const getAllTopicsController = async (
  req: AuthRequest,
  res: Response,
) => {
  // try {
  //   const topics = await getAllTopicsService();
  //   res.status(200).json({
  //     status: "success",
  //     message: "Topics fetched successfully",
  //     data: topics,
  //   });
  // } catch (err) {
  //   res.status(500).json({
  //     status: "error",
  //     message: "Server error fetching topics",
  //     errors: err,
  //   });
  // }
};

export const createLearningPath = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { topic, difficulty } = req.body;

    const result = await createLearningPathService(topic, difficulty);

    return res.status(200).json({
      status: "success",
      message: "Course Created!",
      data: result,
    });
  } catch (err) {
    console.log("Error Creating Course");
    next(err);
  }
};

export default router;
