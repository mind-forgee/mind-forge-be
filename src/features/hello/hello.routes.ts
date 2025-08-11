import { Router } from "express";
import { getHello } from "./hello.controller";

const helloRouter = Router();

helloRouter.get("/hello", getHello);

export default helloRouter;
