import { prisma } from "../lib/prisma";
export class NoteRepository {
    async create(data) {
        return prisma.note.create({
            data,
            include: { author: true },
        });
    }
    async findById(id) {
        return prisma.note.findUnique({
            where: { id },
            include: { author: true },
        });
    }
    async findByAuthorId(authorId) {
        return prisma.note.findMany({
            where: { authorId },
            include: { author: true },
            orderBy: { createdAt: "desc" },
        });
    }
    async findAll(skip, take) {
        return prisma.note.findMany({
            include: { author: true },
            skip,
            take,
            orderBy: { createdAt: "desc" },
        });
    }
    async update(id, data) {
        return prisma.note.update({
            where: { id },
            data,
            include: { author: true },
        });
    }
    async delete(id) {
        return prisma.note.delete({
            where: { id },
        });
    }
    async count(authorId) {
        return prisma.note.count({
            where: authorId ? { authorId } : undefined,
        });
    }
}
//# sourceMappingURL=note.repository.js.map