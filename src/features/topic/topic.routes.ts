import { Router } from "express";
import { createTopic, getAllTopics } from "./topic.controller";
import { validate } from "../../http/validate";
import { createTopicSchema } from "./topic.schema";
import { verifyToken } from "../../middleware/verifyToken";
import { isAdmin } from "../../middleware/isAdmin";

const topicRoutes = Router();

topicRoutes.get("/", getAllTopics);

topicRoutes.post(
  "/",
  verifyToken,
  isAdmin,
  validate(createTopicSchema, "body"),
  createTopic,
);

export default topicRoutes;
