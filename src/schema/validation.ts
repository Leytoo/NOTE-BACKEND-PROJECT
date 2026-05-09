import { z } from "zod";

// Auth Schemas
export const SignupSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .regex(/[A-Z]/, "Password must contain an uppercase letter")
    .regex(/[0-9]/, "Password must contain a number"),
  name: z.string().min(2, "Name must be at least 2 characters").optional(),
});

export const LoginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
});

export const VerifyEmailSchema = z.object({
  token: z.string().min(1, "Token is required"),
});

export const ResendEmailSchema = z.object({
  email: z.string().email("Invalid email address"),
});

export const RefreshTokenSchema = z.object({
  refreshToken: z.string().min(1, "Refresh token is required"),
});

// Note Schemas
export const CreateNoteSchema = z.object({
  title: z.string().min(1, "Title is required").max(255),
  content: z.string().min(1, "Content is required"),
  tags: z.array(z.string()).optional(),
});

export const UpdateNoteSchema = z.object({
  title: z.string().min(1, "Title is required").max(255).optional(),
  content: z.string().min(1, "Content is required").optional(),
  tags: z.array(z.string()).optional(),
});

// Type exports
export type SignupInput = z.infer<typeof SignupSchema>;
export type LoginInput = z.infer<typeof LoginSchema>;
export type VerifyEmailInput = z.infer<typeof VerifyEmailSchema>;
export type ResendEmailInput = z.infer<typeof ResendEmailSchema>;
export type RefreshTokenInput = z.infer<typeof RefreshTokenSchema>;
export type CreateNoteInput = z.infer<typeof CreateNoteSchema>;
export type UpdateNoteInput = z.infer<typeof UpdateNoteSchema>;
