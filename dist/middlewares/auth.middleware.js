import { verifyAccessToken } from "../utils/jwt";
export const authenticateToken = (req, res, next) => {
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
    req.userId = decoded.userId;
    req.userEmail = decoded.email;
    next();
};
export const optionalAuth = (req, res, next) => {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];
    if (token) {
        const decoded = verifyAccessToken(token);
        if (decoded) {
            req.userId = decoded.userId;
            req.userEmail = decoded.email;
        }
    }
    next();
};
//# sourceMappingURL=auth.middleware.js.map