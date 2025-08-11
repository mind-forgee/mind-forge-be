import express from "express";
import helloRouter from "./features/hello/hello.routes";
import { errorHandler } from "./middleware/erorrHandler";
import { checkDatabaseConnection } from "./database/database";

const app = express();
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Checking Database Connection
checkDatabaseConnection();

// Routes
app.get("/", (req, res) => {
  res.status(200).json({
    message: "Welcome to the Mind Forge API",
    timestamp: new Date().toISOString(),
  });
});

app.use(helloRouter);

// Global error handler (should be after routes)
app.use(errorHandler);

export default app;
