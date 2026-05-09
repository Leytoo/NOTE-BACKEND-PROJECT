import { prisma } from "@/lib/prisma";
import type { Token, TokenType } from "@/generated/prisma/client";

export class TokenRepository {
  async create(data: {
    type: TokenType;
    token: string;
    expiresAt: Date;
    userId: string;
  }): Promise<Token> {
    return prisma.token.create({
      data,
    });
  }

  async findByToken(token: string): Promise<Token | null> {
    return prisma.token.findUnique({
      where: { token },
      include: { user: true },
    });
  }

  async findActiveToken(token: string, type: TokenType): Promise<Token | null> {
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

  async consumeToken(tokenId: string): Promise<Token> {
    return prisma.token.update({
      where: { id: tokenId },
      data: { consumedAt: new Date() },
    });
  }

  async revokeToken(tokenId: string): Promise<Token> {
    return prisma.token.update({
      where: { id: tokenId },
      data: { revokedAt: new Date() },
    });
  }

  async findByUserId(userId: string, type?: TokenType): Promise<Token[]> {
    return prisma.token.findMany({
      where: {
        userId,
        ...(type && { type }),
      },
    });
  }

  async deleteExpiredTokens(): Promise<{ count: number }> {
    return prisma.token.deleteMany({
      where: {
        expiresAt: { lt: new Date() },
      },
    });
  }
}
