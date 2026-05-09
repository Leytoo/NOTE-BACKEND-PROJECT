import express from "express";
import { AuthController } from "../controllers/auth.controller";
import { authenticateToken } from "../middlewares/auth.middleware";
const router = express.Router();
const authController = new AuthController();
// Public routes
router.post("/signup", authController.signup);
router.post("/login", authController.login);
router.get("/verify-email", authController.verifyEmailGet);
router.post("/verify-email", authController.verifyEmail);
router.post("/resend-verification-email", authController.resendVerificationEmail);
router.post("/refresh-token", authController.refreshAccessToken);
// Protected routes
router.get("/me", authenticateToken, authController.getMe);
export default router;
//# sourceMappingURL=auth.routes.js.map