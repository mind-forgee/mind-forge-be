import express from "express";

import { verifyToken } from "../../middleware/verifyToken";
import { createCourse } from "./course.controller";

const router = express.Router();

router.post("/", createCourse);

export default router;
