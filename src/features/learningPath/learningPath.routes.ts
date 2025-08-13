import { Router } from "express";
import { getAllTopicsController, saveLearningPathController } from "./learningPath.controller";

import { verifyToken } from "../../middleware/verifyToken";

const router = Router();

router.get("/topics", verifyToken, getAllTopicsController);
router.post("/", verifyToken, saveLearningPathController);

export default router;
