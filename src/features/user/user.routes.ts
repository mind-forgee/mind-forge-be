import express from "express";
import { createUser, loginUser, logoutUser } from "./user.controller";
import { verifyToken } from "../../middleware/verifyToken";
const router = express.Router();

router.post("/", createUser);
router.post("/login", loginUser);
router.post("/logout", logoutUser);

export default router;
