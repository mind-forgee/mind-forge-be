import { Router } from "express";

import { createCourse } from "./course.controller";
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

export default courseRoutes;
