import type { Request, Response } from "express";
import { AuthService } from "@/services/auth.service";
import {
  SignupSchema,
  LoginSchema,
  VerifyEmailSchema,
  ResendEmailSchema,
  RefreshTokenSchema,
} from "@/schema/validation";

export class AuthController {
  private authService = new AuthService();

  signup = async (req: Request, res: Response): Promise<void> => {
    try {
      const input = SignupSchema.parse(req.body);
      const result = await this.authService.signup(input);

      res.status(201).json({
        success: true,
        message: "Signup successful. Please verify your email.",
        data: result,
      });
    } catch (error: any) {
      if (error.name === "ZodError") {
        res.status(400).json({
          success: false,
          message: "Validation error",
          errors: error.errors,
        });
      } else {
        res.status(400).json({
          success: false,
          message: error.message || "Signup failed",
        });
      }
    }
  };

  login = async (req: Request, res: Response): Promise<void> => {
    try {
      const input = LoginSchema.parse(req.body);
      const result = await this.authService.login(input);

      res.status(200).json({
        success: true,
        message: "Login successful",
        data: result,
      });
    } catch (error: any) {
      if (error.name === "ZodError") {
        res.status(400).json({
          success: false,
          message: "Validation error",
          errors: error.errors,
        });
      } else if (error.message.includes("Email not verified")) {
        res.status(403).json({
          success: false,
          message: error.message,
          code: "EMAIL_NOT_VERIFIED",
        });
      } else {
        res.status(401).json({
          success: false,
          message: error.message || "Login failed",
        });
      }
    }
  };

  verifyEmailGet = async (req: Request, res: Response): Promise<void> => {
    try {
      const { token } = req.query as { token: string };
      if (!token) {
        res.status(400).json({
          success: false,
          message: "Verification token is required",
        });
        return;
      }

      const user = await this.authService.verifyEmail(token);

      res.status(200).json({
        success: true,
        message: "Email verified successfully",
        data: { userId: user.id, email: user.email },
      });
    } catch (error: any) {
      res.status(400).json({
        success: false,
        message: error.message || "Email verification failed",
      });
    }
  };

  verifyEmail = async (req: Request, res: Response): Promise<void> => {
    try {
      const input = VerifyEmailSchema.parse(req.body);
      const user = await this.authService.verifyEmail(input.token);

      res.status(200).json({
        success: true,
        message: "Email verified successfully",
        data: { userId: user.id, email: user.email },
      });
    } catch (error: any) {
      if (error.name === "ZodError") {
        res.status(400).json({
          success: false,
          message: "Validation error",
          errors: error.errors,
        });
      } else {
        res.status(400).json({
          success: false,
          message: error.message || "Email verification failed",
        });
      }
    }
  };

  resendVerificationEmail = async (
    req: Request,
    res: Response
  ): Promise<void> => {
    try {
      const input = ResendEmailSchema.parse(req.body);
      await this.authService.resendVerificationEmail(input.email);

      res.status(200).json({
        success: true,
        message: "Verification email sent. Please check your inbox.",
      });
    } catch (error: any) {
      if (error.name === "ZodError") {
        res.status(400).json({
          success: false,
          message: "Validation error",
          errors: error.errors,
        });
      } else {
        res.status(400).json({
          success: false,
          message: error.message || "Failed to resend verification email",
        });
      }
    }
  };

  refreshAccessToken = async (req: Request, res: Response): Promise<void> => {
    try {
      const input = RefreshTokenSchema.parse(req.body);
      const result = await this.authService.refreshAccessToken(
        input.refreshToken
      );

      res.status(200).json({
        success: true,
        message: "Access token refreshed",
        data: result,
      });
    } catch (error: any) {
      if (error.name === "ZodError") {
        res.status(400).json({
          success: false,
          message: "Validation error",
          errors: error.errors,
        });
      } else {
        res.status(401).json({
          success: false,
          message: error.message || "Failed to refresh token",
        });
      }
    }
  };

  getMe = async (req: Request, res: Response): Promise<void> => {
    try {
      const userId = (req as any).userId;
      if (!userId) {
        res.status(401).json({
          success: false,
          message: "Unauthorized",
        });
        return;
      }

      const user = await this.authService.getUserById(userId);
      if (!user) {
        res.status(404).json({
          success: false,
          message: "User not found",
        });
        return;
      }

      res.status(200).json({
        success: true,
        data: user,
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: error.message || "Failed to get user",
      });
    }
  };
}
