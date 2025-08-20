import { NextFunction, Response } from "express";
import { APIResponse } from "../../models/response";
import z from "zod";
import {
  createCourseService,
  getUserCourseService,
  selectCompleteChapterService,
} from "./course.service";
import { createCourseSchema } from "./course.schema";
import { AuthRequest } from "../../middleware/verifyToken";

export const createCourse = async (
  req: AuthRequest,
  res: Response<APIResponse>,
  next: NextFunction,
) => {
  try {
    const { topic_id, difficulty } = req.body as z.infer<
      typeof createCourseSchema
    >;

    const result = await createCourseService(
      topic_id,
      difficulty,
      req.user?.user_id as string,
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

export const getUserCourse = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
) => {
  const userId = req.user?.user_id as string;

  try {
    const course = await getUserCourseService(userId);
    return res.status(200).json({
      status: "success",
      message: "Success get course!",
      data: course,
    });
  } catch (err) {
    console.log("Error get selected course");
    next(err);
  }
};

export const selectCompleteChapter = async (
  req: AuthRequest,
  res: Response<APIResponse>,
  next: NextFunction,
) => {
  try {
    const user_id = req?.user?.user_id;
    const { chapter_id } = req.params;

    const completedChapter = await selectCompleteChapterService(
      user_id as string,
      chapter_id,
    );

    return res.status(200).json({
      message: "Chapter completed successfully",
      status: "success",
      data: completedChapter,
    });
  } catch (err) {
    console.log("Error select complete chapter");
    next(err);
  }
};
