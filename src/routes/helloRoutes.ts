import { Router } from "express";
import { getHello } from "../controllers/helloController";

const helloRouter = Router();

helloRouter.get("/hello", getHello);

export default helloRouter;
