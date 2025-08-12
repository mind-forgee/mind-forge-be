import express from "express";
import { createUser, loginUser, logoutUser } from "./user.controller";
import { validate } from "../../http/validate";
import { createUserSchema, loginUserSchema } from "./user.schema";

const router = express.Router();

router.post("/register", validate(createUserSchema, "body"), createUser);
router.post("/login", validate(loginUserSchema, "body"), loginUser);
router.post("/logout", logoutUser);

export default router;
