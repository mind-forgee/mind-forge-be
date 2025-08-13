import { NextFunction, Response, Request } from "express";
import { APIResponse } from "../../models/response";
import { createCourseService } from "./course.service";

export const createCourse = async (
  req: Request,
  res: Response<APIResponse>,
  next: NextFunction,
) => {
  try {
    const { topic, difficulty } = req.body;

    const result = await createCourseService(topic, difficulty);

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
