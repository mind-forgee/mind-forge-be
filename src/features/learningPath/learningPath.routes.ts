import { Router, Response } from "express";
import { AuthRequest } from "../../middleware/verifyToken";
import { getAllTopicsService, saveUserLearningPathService } from "./learningPath.service";

const router = Router();

// GET /api/learning-path/topics - fetch all available topics
router.get("/topics", async (req: AuthRequest, res: Response) => {
  try {
    const topics = await getAllTopicsService();
    res.status(200).json(topics);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error fetching topics" });
  }
});

// POST /api/learning-path - save user's chosen topic and level
router.post("/", async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const { topicId, level } = req.body;

    if (!topicId || !level) {
      return res.status(400).json({ message: "topicId and level are required" });
    }

    const saved = await saveUserLearningPathService(req.user.user_id, topicId, level);
    res.status(201).json({ message: "Learning path saved", learningPath: saved });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error saving learning path" });
  }
});

export default router;
