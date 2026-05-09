import crypto from "crypto";
// Simple password hashing using PBKDF2
export const hashPassword = (password) => {
    const salt = crypto.randomBytes(16).toString("hex");
    const hash = crypto
        .pbkdf2Sync(password, salt, 1000, 64, "sha512")
        .toString("hex");
    return `${salt}:${hash}`;
};
export const comparePassword = (password, hash) => {
    try {
        const [salt, hashPart] = hash.split(":");
        const hashedPassword = crypto
            .pbkdf2Sync(password, salt, 1000, 64, "sha512")
            .toString("hex");
        return hashedPassword === hashPart;
    }
    catch {
        return false;
    }
};
//# sourceMappingURL=password.js.map