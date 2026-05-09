import { NoteRepository } from "@/repositories/note.repository";
import type { Note } from "@/generated/prisma/client";

export class NoteService {
  private noteRepository = new NoteRepository();

  async createNote(
    authorId: string,
    data: {
      title: string;
      content: string;
      tags?: string[];
    }
  ): Promise<Note> {
    return this.noteRepository.create({
      ...data,
      authorId,
    });
  }

  async getNoteById(id: string): Promise<Note | null> {
    return this.noteRepository.findById(id);
  }

  async getNotesByAuthorId(authorId: string): Promise<Note[]> {
    return this.noteRepository.findByAuthorId(authorId);
  }

  async getAllNotes(skip?: number, take?: number): Promise<Note[]> {
    return this.noteRepository.findAll(skip, take);
  }

  async updateNote(
    id: string,
    authorId: string,
    data: {
      title?: string;
      content?: string;
      tags?: string[];
    }
  ): Promise<Note> {
    // Check if note exists and belongs to user
    const note = await this.noteRepository.findById(id);
    if (!note) {
      throw new Error("Note not found");
    }

    if (note.authorId !== authorId) {
      throw new Error("Unauthorized: This note does not belong to you");
    }

    return this.noteRepository.update(id, data);
  }

  async deleteNote(id: string, authorId: string): Promise<void> {
    // Check if note exists and belongs to user
    const note = await this.noteRepository.findById(id);
    if (!note) {
      throw new Error("Note not found");
    }

    if (note.authorId !== authorId) {
      throw new Error("Unauthorized: This note does not belong to you");
    }

    await this.noteRepository.delete(id);
  }

  async countNotesByAuthorId(authorId: string): Promise<number> {
    return this.noteRepository.count(authorId);
  }

  async searchNotes(
    authorId: string,
    query: string
  ): Promise<Note[]> {
    const notes = await this.getNotesByAuthorId(authorId);
    return notes.filter(
      (note) =>
        note.title.toLowerCase().includes(query.toLowerCase()) ||
        note.content.toLowerCase().includes(query.toLowerCase()) ||
        note.tags.some((tag) =>
          tag.toLowerCase().includes(query.toLowerCase())
        )
    );
  }
}
