import { Router } from "express";

import { createCourse, getUserCourse } from "./course.controller";
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

export default courseRoutes;
