import jwt from "jsonwebtoken";
const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key";
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || "your-refresh-secret-key";
const JWT_EMAIL_SECRET = process.env.JWT_EMAIL_SECRET || "your-email-secret-key";
export const generateAccessToken = (payload) => {
    return jwt.sign(payload, JWT_SECRET, {
        expiresIn: "15m",
    });
};
export const generateRefreshToken = (userId) => {
    return jwt.sign({ userId }, JWT_REFRESH_SECRET, {
        expiresIn: "7d",
    });
};
export const generateEmailVerificationToken = (userId) => {
    return jwt.sign({ userId }, JWT_EMAIL_SECRET, {
        expiresIn: "24h",
    });
};
export const verifyAccessToken = (token) => {
    try {
        return jwt.verify(token, JWT_SECRET);
    }
    catch {
        return null;
    }
};
export const verifyRefreshToken = (token) => {
    try {
        return jwt.verify(token, JWT_REFRESH_SECRET);
    }
    catch {
        return null;
    }
};
export const verifyEmailToken = (token) => {
    try {
        return jwt.verify(token, JWT_EMAIL_SECRET);
    }
    catch {
        return null;
    }
};
//# sourceMappingURL=jwt.js.map