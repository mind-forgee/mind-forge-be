import { Router } from "express";

import {
  createCourse,
  getUserCourse,
  selectCompleteChapter,
} from "./course.controller";
import { verifyToken } from "../../middleware/verifyToken";
import { validate } from "../../http/validate";
import { createCourseSchema } from "./course.schema";

const courseRoutes = Router();

courseRoutes.post(
  "/",
  verifyToken,
  validate(createCourseSchema, "body"),
  createCourse,
);

courseRoutes.get("/", verifyToken, getUserCourse);
courseRoutes.patch("/:chapter_id", verifyToken, selectCompleteChapter);

export default courseRoutes;
