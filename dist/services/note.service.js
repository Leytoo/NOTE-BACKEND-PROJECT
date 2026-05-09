import { NoteRepository } from "../repositories/note.repository";
export class NoteService {
    noteRepository = new NoteRepository();
    async createNote(authorId, data) {
        return this.noteRepository.create({
            ...data,
            authorId,
        });
    }
    async getNoteById(id) {
        return this.noteRepository.findById(id);
    }
    async getNotesByAuthorId(authorId) {
        return this.noteRepository.findByAuthorId(authorId);
    }
    async getAllNotes(skip, take) {
        return this.noteRepository.findAll(skip, take);
    }
    async updateNote(id, authorId, data) {
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
    async deleteNote(id, authorId) {
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
    async countNotesByAuthorId(authorId) {
        return this.noteRepository.count(authorId);
    }
    async searchNotes(authorId, query) {
        const notes = await this.getNotesByAuthorId(authorId);
        return notes.filter((note) => note.title.toLowerCase().includes(query.toLowerCase()) ||
            note.content.toLowerCase().includes(query.toLowerCase()) ||
            note.tags.some((tag) => tag.toLowerCase().includes(query.toLowerCase())));
    }
}
//# sourceMappingURL=note.service.js.map