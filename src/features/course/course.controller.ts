import { NextFunction, Response } from "express";
import { APIResponse } from "../../models/response";
import z from "zod";
import { createCourseService } from "./course.service";
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
