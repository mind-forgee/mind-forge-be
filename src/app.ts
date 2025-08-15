import express from "express";
import { errorHandler } from "./middleware/erorrHandler";
import userRoutes from "./features/user/user.routes";
import cors from "cors";
import cookieParser from "cookie-parser";

const app = express();
app.use(
  cors({
    origin: "*",
    credentials: true,
  }),
);
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use("/api/auth", userRoutes);
// app.use('/api/course', )

app.get("/", (req, res) => {
  res.status(200).json({
    message: "Welcome to Mind Forge API",
  });
});

app.use(errorHandler);

export default app;
