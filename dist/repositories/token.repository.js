import { prisma } from "../lib/prisma";
export class TokenRepository {
    async create(data) {
        return prisma.token.create({
            data,
        });
    }
    async findByToken(token) {
        return prisma.token.findUnique({
            where: { token },
            include: { user: true },
        });
    }
    async findActiveToken(token, type) {
        return prisma.token.findFirst({
            where: {
                token,
                type,
                expiresAt: { gt: new Date() },
                revokedAt: null,
                consumedAt: null,
            },
            include: { user: true },
        });
    }
    async consumeToken(tokenId) {
        return prisma.token.update({
            where: { id: tokenId },
            data: { consumedAt: new Date() },
        });
    }
    async revokeToken(tokenId) {
        return prisma.token.update({
            where: { id: tokenId },
            data: { revokedAt: new Date() },
        });
    }
    async findByUserId(userId, type) {
        return prisma.token.findMany({
            where: {
                userId,
                ...(type && { type }),
            },
        });
    }
    async deleteExpiredTokens() {
        return prisma.token.deleteMany({
            where: {
                expiresAt: { lt: new Date() },
            },
        });
    }
}
//# sourceMappingURL=token.repository.js.map