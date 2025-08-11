import express from "express";
import { errorHandler } from "./middleware/erorrHandler";
import userRoutes from "./features/user/user.routes";
import cors from "cors";
import cookieParser from "cookie-parser";

const app = express();
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(
  cors({
    origin: "localhost:5173",
    credentials: true,
  }),
);

// Global error handler (should be after routes)
app.use("/api/auth", userRoutes);

app.use(errorHandler);

export default app;
