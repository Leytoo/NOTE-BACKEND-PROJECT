import type { Request, Response, NextFunction } from "express";
import { verifyAccessToken } from "@/utils/jwt";

export const authenticateToken = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1]; // "Bearer TOKEN"

  if (!token) {
    res.status(401).json({
      success: false,
      message: "Access token is required",
    });
    return;
  }

  const decoded = verifyAccessToken(token);
  if (!decoded) {
    res.status(403).json({
      success: false,
      message: "Invalid or expired access token",
    });
    return;
  }

  (req as any).userId = decoded.userId;
  (req as any).userEmail = decoded.email;
  next();
};

export const optionalAuth = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (token) {
    const decoded = verifyAccessToken(token);
    if (decoded) {
      (req as any).userId = decoded.userId;
      (req as any).userEmail = decoded.email;
    }
  }

  next();
};
