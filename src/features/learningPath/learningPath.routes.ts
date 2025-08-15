import { Router } from "express";
import {
  getAllTopicsController,
  saveLearningPathController,
} from "./learningPath.controller";

import { verifyToken } from "../../middleware/verifyToken";
import { saveLearningPathSchema } from "./learningPath.schema";
import { validate } from "../../http/validate";

const router = Router();

router.get("/topics", verifyToken, getAllTopicsController);
router.post(
  "/",
  verifyToken,
  validate(saveLearningPathSchema, "body"),
  saveLearningPathController,
);

export default router;
