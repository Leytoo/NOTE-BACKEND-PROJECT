import { prisma } from "@/lib/prisma";
import type { Note } from "@/generated/prisma/client";

export class NoteRepository {
  async create(data: {
    title: string;
    content: string;
    tags?: string[];
    authorId: string;
  }): Promise<Note> {
    return prisma.note.create({
      data,
      include: { author: true },
    });
  }

  async findById(id: string): Promise<Note | null> {
    return prisma.note.findUnique({
      where: { id },
      include: { author: true },
    });
  }

  async findByAuthorId(authorId: string): Promise<Note[]> {
    return prisma.note.findMany({
      where: { authorId },
      include: { author: true },
      orderBy: { createdAt: "desc" },
    });
  }

  async findAll(skip?: number, take?: number): Promise<Note[]> {
    return prisma.note.findMany({
      include: { author: true },
      skip,
      take,
      orderBy: { createdAt: "desc" },
    });
  }

  async update(
    id: string,
    data: Partial<Omit<Note, "id" | "createdAt" | "authorId">>
  ): Promise<Note> {
    return prisma.note.update({
      where: { id },
      data,
      include: { author: true },
    });
  }

  async delete(id: string): Promise<Note> {
    return prisma.note.delete({
      where: { id },
    });
  }

  async count(authorId?: string): Promise<number> {
    return prisma.note.count({
      where: authorId ? { authorId } : undefined,
    });
  }
}
