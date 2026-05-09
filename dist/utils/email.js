import nodemailer from "nodemailer";
const SMTP_HOST = process.env.SMTP_HOST || "smtp.gmail.com";
const SMTP_PORT = parseInt(process.env.SMTP_PORT || "587");
const SMTP_USER = process.env.SMTP_USER || "your-email@gmail.com";
const SMTP_PASSWORD = process.env.SMTP_PASSWORD || "your-app-password";
const FRONTEND_URL = process.env.FRONTEND_URL || "http://localhost:3000";
const transporter = nodemailer.createTransport({
    host: SMTP_HOST,
    port: SMTP_PORT,
    secure: SMTP_PORT === 465,
    auth: {
        user: SMTP_USER,
        pass: SMTP_PASSWORD,
    },
});
export const sendVerificationEmail = async (email, verificationLink) => {
    const mailOptions = {
        from: SMTP_USER,
        to: email,
        subject: "Email Verification",
        html: `
      <h2>Email Verification</h2>
      <p>Please click the link below to verify your email:</p>
      <a href="${verificationLink}">Verify Email</a>
      <p>Or copy this link: ${verificationLink}</p>
      <p>This link expires in 24 hours.</p>
    `,
    };
    await transporter.sendMail(mailOptions);
};
export const sendPasswordResetEmail = async (email, resetLink) => {
    const mailOptions = {
        from: SMTP_USER,
        to: email,
        subject: "Password Reset",
        html: `
      <h2>Password Reset</h2>
      <p>Please click the link below to reset your password:</p>
      <a href="${resetLink}">Reset Password</a>
      <p>Or copy this link: ${resetLink}</p>
      <p>This link expires in 1 hour.</p>
    `,
    };
    await transporter.sendMail(mailOptions);
};
//# sourceMappingURL=email.js.map