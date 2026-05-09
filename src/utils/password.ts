import crypto from "crypto";

// Simple password hashing using PBKDF2
export const hashPassword = (password: string): string => {
  const salt = crypto.randomBytes(16).toString("hex");
  const hash = crypto
    .pbkdf2Sync(password, salt, 1000, 64, "sha512")
    .toString("hex");
  return `${salt}:${hash}`;
};

export const comparePassword = (password: string, hash: string): boolean => {
  try {
    const [salt, hashPart] = hash.split(":");
    const hashedPassword = crypto
      .pbkdf2Sync(password, salt, 1000, 64, "sha512")
      .toString("hex");
    return hashedPassword === hashPart;
  } catch {
    return false;
  }
};
