import express from "express";
import { createTopic } from "./topic.controller";
import { validate } from "../../http/validate";
import { createTopicSchema } from "./topic.schema";
import { verifyToken } from "../../middleware/verifyToken";
import { isAdmin } from "../../middleware/isAdmin";

const router = express.Router();

router.post(
  "/",
  verifyToken,
  isAdmin,
  validate(createTopicSchema, "body"),
  createTopic,
);

export default router;
