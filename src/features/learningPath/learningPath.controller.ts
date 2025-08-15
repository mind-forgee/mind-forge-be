import { Request, Response, NextFunction } from "express";
import { AuthRequest } from "../../middleware/verifyToken";
import {
  getAllTopicsService,
  createLearningPathService,
  getChapterByCourseIdService,
} from "./learningPath.service";
import { APIResponse } from "../../models/response";
import { CheckParams } from "zod/v4/core/api.cjs";
import express from "express";

const router = express.Router();

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
  res: Response<APIResponse>,
  next: NextFunction,
) => {
  const user_id = req.user?.user_id;
  try {
    const { topic, difficulty } = req.body;

    const result = await createLearningPathService(
      user_id as string,
      topic,
      difficulty,
    );

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

type ChapterParams = {
  courseId: string;
};

export const getChapterByCourseId = async (
  req: Request<ChapterParams>,
  res: Response<APIResponse>,
  next: NextFunction,
) => {
  try {
    const { courseId } = req.params;
    const result = await getChapterByCourseIdService(courseId);

    return res.status(200).json({
      status: "success",
      message: "Get chapter success",
      data: result,
    });
  } catch (err) {
    console.log("Error get course");
    next(err);
  }
};

export default router;
