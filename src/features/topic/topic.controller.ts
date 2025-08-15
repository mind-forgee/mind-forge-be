import { NextFunction, Response } from "express";
import { AuthRequest } from "../../middleware/verifyToken";
import { createTopicService } from "./topic.service";
import { APIResponse } from "../../models/response";
import { createTopicSchema } from "./topic.schema";

export const createTopic = async (
  req: AuthRequest,
  res: Response<APIResponse>,
  next: NextFunction,
) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        status: "error",
        message: "Unauthorized",
      });
    }

    if (req.user.role !== "admin") {
      return res.status(403).json({
        status: "error",
        message: "Forbidden: Admins only",
      });
    }

    const { name, description } = createTopicSchema.parse(req.body);

    const topic = await createTopicService(
      name,
      description || null,
      req.user.user_id,
    );

    return res.status(201).json({
      status: "success",
      message: "Topic created successfully",
      data: topic,
    });
  } catch (err) {
    next(err);
  }
};
