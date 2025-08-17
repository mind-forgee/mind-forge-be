import express from "express";
import { errorHandler } from "./middleware/erorrHandler";
import userRoutes from "./features/user/user.routes";
import cors from "cors";
import cookieParser from "cookie-parser";
import courseRoutes from "./features/course/course.route";
import topicRoutes from "./features/topic/topic.routes";
import "./shared/chapterQueue";

const app = express();
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors());

app.use("/api/auth", userRoutes);
app.use("/api/courses", courseRoutes);
app.use("/api/topics", topicRoutes);

app.get("/", (req, res) => {
  res.status(200).json({
    message: "Welcome to Mind Forge API",
  });
});

app.use(errorHandler);

export default app;
