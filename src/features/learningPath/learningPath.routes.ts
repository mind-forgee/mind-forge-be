import { Router } from "express";
import {
  getAllTopicsController,
  createLearningPath,
  getChapterByCourseId,
} from "./learningPath.controller";

import { verifyToken } from "../../middleware/verifyToken";

const router = Router();

router.get("/topics", verifyToken, getAllTopicsController);
router.get("/courses/:courseId/chapter", verifyToken, getChapterByCourseId);
router.post("/", verifyToken, createLearningPath);

export default router;
