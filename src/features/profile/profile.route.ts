import { Router } from "express";
import { verifyToken } from "../../middleware/verifyToken";
import { updateProfile } from "./profile.controller";
import { validate } from "../../http/validate";
import { profileUpdateSchema } from "./profile.schema";
const router = Router();

router.patch(
  "/update",
  validate(profileUpdateSchema, "body"),
  verifyToken,
  updateProfile,
);

export default router;
