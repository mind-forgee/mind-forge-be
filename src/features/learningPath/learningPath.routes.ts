import { Router } from "express";
import {
  getAllTopicsController,
  createLearningPath,
} from "./learningPath.controller";

import { verifyToken } from "../../middleware/verifyToken";

const router = Router();

router.get("/topics", verifyToken, getAllTopicsController);
router.post("/", verifyToken, createLearningPath);

export default router;
