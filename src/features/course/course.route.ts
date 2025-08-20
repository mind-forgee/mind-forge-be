import { Router } from "express";

import {
  createCourse,
  deleteSelectedCourse,
  getAllCourse,
  getUserCourse,
  selectCompleteChapter,
} from "./course.controller";
import { verifyToken } from "../../middleware/verifyToken";
import { validate } from "../../http/validate";
import { createCourseSchema, deleteCourseSchema } from "./course.schema";
import { isAdmin } from "../../middleware/isAdmin";

const courseRoutes = Router();

courseRoutes.post(
  "/",
  verifyToken,
  validate(createCourseSchema, "body"),
  createCourse,
);

courseRoutes.get("/", verifyToken, getUserCourse);
courseRoutes.patch("/:chapter_id", verifyToken, selectCompleteChapter);
courseRoutes.get("/all-courses", verifyToken, isAdmin, getAllCourse);

courseRoutes.delete(
  "/:course_id",
  verifyToken,
  isAdmin,
  validate(deleteCourseSchema, "params"),
  deleteSelectedCourse,
);

export default courseRoutes;
