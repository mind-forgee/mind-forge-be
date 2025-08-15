import express from "express";
import { createTopic } from "./topic.controller";
import { validate } from "../../http/validate";
import { createTopicSchema } from "./topic.schema";
import { verifyToken } from "../../middleware/verifyToken";

const router = express.Router();

router.post("/", verifyToken, validate(createTopicSchema, "body"), createTopic);

export default router;
