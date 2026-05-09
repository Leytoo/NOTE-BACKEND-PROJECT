import { UserRepository } from "../repositories/user.repository";
import { TokenRepository } from "../repositories/token.repository";
import { hashPassword, comparePassword, generateAccessToken, generateRefreshToken, generateEmailVerificationToken, verifyEmailToken, sendVerificationEmail, } from "../utils";
const FRONTEND_URL = process.env.FRONTEND_URL || "http://localhost:3000";
export class AuthService {
    userRepository = new UserRepository();
    tokenRepository = new TokenRepository();
    async signup(input) {
        // Check if user already exists
        const existingUser = await this.userRepository.findByEmail(input.email);
        if (existingUser) {
            throw new Error("User with this email already exists");
        }
        // Hash password
        const hashedPassword = hashPassword(input.password);
        // Create user
        const user = await this.userRepository.create({
            email: input.email,
            password: hashedPassword,
            name: input.name,
        });
        // Generate tokens
        const accessToken = generateAccessToken({
            userId: user.id,
            email: user.email,
        });
        const refreshToken = generateRefreshToken(user.id);
        // Store refresh token
        await this.tokenRepository.create({
            type: "REFRESH",
            token: refreshToken,
            expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
            userId: user.id,
        });
        // Send verification email
        const emailToken = generateEmailVerificationToken(user.id);
        await this.tokenRepository.create({
            type: "EMAIL_VERIFY",
            token: emailToken,
            expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 hours
            userId: user.id,
        });
        const verificationLink = `${FRONTEND_URL}/api/auth/verify-email?token=${emailToken}`;
        await sendVerificationEmail(user.email, verificationLink);
        // Return user without password
        const { password: _, ...userWithoutPassword } = user;
        return {
            user: userWithoutPassword,
            accessToken,
            refreshToken,
        };
    }
    async login(input) {
        // Find user by email
        const user = await this.userRepository.findByEmail(input.email);
        if (!user) {
            throw new Error("Invalid email or password");
        }
        // Check if email is verified
        if (!user.emailVerified) {
            throw new Error("Email not verified. Please check your email and verify your account before logging in.");
        }
        // Compare password
        const isPasswordValid = comparePassword(input.password, user.password);
        if (!isPasswordValid) {
            throw new Error("Invalid email or password");
        }
        // Generate tokens
        const accessToken = generateAccessToken({
            userId: user.id,
            email: user.email,
        });
        const refreshToken = generateRefreshToken(user.id);
        // Store refresh token
        await this.tokenRepository.create({
            type: "REFRESH",
            token: refreshToken,
            expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
            userId: user.id,
        });
        // Return user without password
        const { password: _, ...userWithoutPassword } = user;
        return {
            user: userWithoutPassword,
            accessToken,
            refreshToken,
        };
    }
    async verifyEmail(token) {
        // Verify email token
        const decoded = verifyEmailToken(token);
        if (!decoded) {
            throw new Error("Invalid or expired email verification token");
        }
        // Check if token exists in database and not consumed
        const dbToken = await this.tokenRepository.findActiveToken(token, "EMAIL_VERIFY");
        if (!dbToken) {
            throw new Error("Invalid or expired email verification token");
        }
        // Mark token as consumed
        await this.tokenRepository.consumeToken(dbToken.id);
        // Verify email
        const user = await this.userRepository.verifyEmail(decoded.userId);
        return user;
    }
    async resendVerificationEmail(email) {
        // Find user by email
        const user = await this.userRepository.findByEmail(email);
        if (!user) {
            throw new Error("User not found");
        }
        // Check if email already verified
        if (user.emailVerified) {
            throw new Error("Email already verified");
        }
        // Generate new email token
        const emailToken = generateEmailVerificationToken(user.id);
        await this.tokenRepository.create({
            type: "EMAIL_VERIFY",
            token: emailToken,
            expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 hours
            userId: user.id,
        });
        const verificationLink = `${FRONTEND_URL}/api/auth/verify-email?token=${emailToken}`;
        await sendVerificationEmail(user.email, verificationLink);
    }
    async refreshAccessToken(refreshToken) {
        // Check if refresh token exists in database and is valid
        const dbToken = await this.tokenRepository.findActiveToken(refreshToken, "REFRESH");
        if (!dbToken) {
            throw new Error("Invalid or expired refresh token");
        }
        // Get user
        const user = await this.userRepository.findById(dbToken.userId);
        if (!user) {
            throw new Error("User not found");
        }
        // Generate new access token
        const accessToken = generateAccessToken({
            userId: user.id,
            email: user.email,
        });
        return { accessToken };
    }
    async getUserById(userId) {
        const user = await this.userRepository.findById(userId);
        if (!user)
            return null;
        const { password: _, ...userWithoutPassword } = user;
        return userWithoutPassword;
    }
}
//# sourceMappingURL=auth.service.js.map