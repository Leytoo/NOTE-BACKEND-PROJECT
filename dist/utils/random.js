import crypto from "crypto";
export const generateRandomToken = () => {
    return crypto.randomBytes(32).toString("hex");
};
export const generateOTP = () => {
    return Math.floor(100000 + Math.random() * 900000).toString();
};
//# sourceMappingURL=random.js.map