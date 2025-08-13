import express from "express";
import { errorHandler } from "./middleware/erorrHandler";
import cors from "cors";
import cookieParser from "cookie-parser";
import userRoutes from "./features/user/user.routes";
import courseRoutes from "./features/course/course.route";

const app = express();
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  }),
);

app.use("/api/auth", userRoutes);
app.use("/api/course", courseRoutes);

app.get("/", (req, res) => {
  res.status(200).json({
    message: "Welcome to Mind Forge API",
  });
});

app.use(errorHandler);

export default app;
