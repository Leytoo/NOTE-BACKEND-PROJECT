import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key";
const JWT_REFRESH_SECRET =
  process.env.JWT_REFRESH_SECRET || "your-refresh-secret-key";
const JWT_EMAIL_SECRET =
  process.env.JWT_EMAIL_SECRET || "your-email-secret-key";

export interface JwtPayload {
  userId: string;
  email: string;
}

export const generateAccessToken = (payload: JwtPayload): string => {
  return jwt.sign(payload, JWT_SECRET, {
    expiresIn: "15m",
  });
};

export const generateRefreshToken = (userId: string): string => {
  return jwt.sign({ userId }, JWT_REFRESH_SECRET, {
    expiresIn: "7d",
  });
};

export const generateEmailVerificationToken = (userId: string): string => {
  return jwt.sign({ userId }, JWT_EMAIL_SECRET, {
    expiresIn: "24h",
  });
};

export const verifyAccessToken = (token: string): JwtPayload | null => {
  try {
    return jwt.verify(token, JWT_SECRET) as JwtPayload;
  } catch {
    return null;
  }
};

export const verifyRefreshToken = (token: string): { userId: string } | null => {
  try {
    return jwt.verify(token, JWT_REFRESH_SECRET) as { userId: string };
  } catch {
    return null;
  }
};

export const verifyEmailToken = (token: string): { userId: string } | null => {
  try {
    return jwt.verify(token, JWT_EMAIL_SECRET) as { userId: string };
  } catch {
    return null;
  }
};
