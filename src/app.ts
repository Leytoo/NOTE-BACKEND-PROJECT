import express, { type Request, type Response } from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import {
  requestLogger,
  errorHandler,
  notFoundHandler,
} from "@/middlewares";
import routes from "@/routes";

const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use(cookieParser());
app.use(requestLogger);

// Health check
app.get("/health", (req: Request, res: Response) => {
  res.json({
    success: true,
    message: "Server is running",
    timestamp: new Date().toISOString(),
  });
});

// API routes
app.use("/api", routes);

// Error handling
app.use(notFoundHandler);
app.use(errorHandler);

export default app;
