import { prisma } from "../lib/prisma";
export class UserRepository {
    async findByEmail(email) {
        return prisma.user.findUnique({
            where: { email },
        });
    }
    async findById(id) {
        return prisma.user.findUnique({
            where: { id },
        });
    }
    async create(data) {
        return prisma.user.create({
            data,
        });
    }
    async update(id, data) {
        return prisma.user.update({
            where: { id },
            data,
        });
    }
    async verifyEmail(id) {
        return prisma.user.update({
            where: { id },
            data: {
                emailVerified: new Date(),
            },
        });
    }
    async delete(id) {
        return prisma.user.delete({
            where: { id },
        });
    }
}
//# sourceMappingURL=user.repository.js.map