import { Router, Response } from "express";
import { AuthRequest } from "../../middleware/verifyToken";
import { getAllTopicsService, saveUserLearningPathService } from "./learningPath.service";
import { APIResponse } from "../../models/response";

const router = Router();

// GET /api/learning-path/topics - fetch all available topics
export const getAllTopicsController = async (req: AuthRequest, res: Response) => {
  try {
    const topics = await getAllTopicsService();
    res.status(200).json({
      status: "success",
      message: "Topics fetched successfully",
      data: topics,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      status: "error",
      message: "Server error fetching topics",
      errors: err,
    });
  }
};

// POST /api/learning-path - save user's chosen topic and level
export const saveLearningPathController = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        status: "error",
        message: "Unauthorized",
      });
    }

    const { topicId, level } = req.body;

    if (!topicId || !level) {
      return res.status(400).json({
        status: "error",
        message: "topicId and level are required",
      });
    }

    const saved = await saveUserLearningPathService(req.user.user_id, topicId, level);

    res.status(201).json({
      status: "success",
      message: "Learning path saved successfully",
      data: saved,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      status: "error",
      message: "Server error saving learning path",
      errors: err,
    });
  }
};

export default router;
