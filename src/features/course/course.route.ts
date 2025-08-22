import { Router } from "express";

import {
  collectStudyCaseProof,
  createCourse,
  deleteSelectedCourse,
  getAllCourse,
  getAllStudyCaseProofs,
  getUserCourse,
  selectCompleteChapter,
  updateStatusStudyCase,
} from "./course.controller";
import { verifyToken } from "../../middleware/verifyToken";
import { validate } from "../../http/validate";
import {
  collectStudyCaseProofSchema,
  createCourseSchema,
  deleteCourseSchema,
  updateStatusStudyCaseSchema,
} from "./course.schema";
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

courseRoutes.post(
  "/chapter/:chapter_id/study-case",
  verifyToken,
  validate(collectStudyCaseProofSchema, "body"),
  collectStudyCaseProof,
);

courseRoutes.get(
  "/study-case/proofs",
  verifyToken,
  isAdmin,
  getAllStudyCaseProofs,
);

courseRoutes.patch(
  "/study-case/proofs/status",
  verifyToken,
  isAdmin,
  validate(updateStatusStudyCaseSchema, "body"),
  updateStatusStudyCase,
);

export default courseRoutes;
