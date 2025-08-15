import express from "express";
import { errorHandler } from "./middleware/erorrHandler";
import userRoutes from "./features/user/user.routes";
import topicRoutes from "./features/topic/topic.routes";
import learningPathRoutes from "./features/learningPath/learningPath.routes";
import cors from "cors";
import cookieParser from "cookie-parser";

const app = express();
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(
  cors({
    origin: "*",
  }),
);

app.use("/api/auth", userRoutes);
// app.use('/api/course', )
app.use("/api/topics", topicRoutes);

app.use("/api/learning-path", learningPathRoutes);
app.get("/", (req, res) => {
  res.status(200).json({
    message: "Welcome to Mind Forge API",
  });
});

app.use(errorHandler);

export default app;
