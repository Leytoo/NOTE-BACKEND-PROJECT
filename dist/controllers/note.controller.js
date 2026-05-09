import { NoteService } from "../services/note.service";
import { CreateNoteSchema, UpdateNoteSchema } from "../schema/validation";
export class NoteController {
    noteService = new NoteService();
    createNote = async (req, res) => {
        try {
            const input = CreateNoteSchema.parse(req.body);
            const userId = req.userId;
            if (!userId) {
                res.status(401).json({
                    success: false,
                    message: "Unauthorized",
                });
                return;
            }
            const note = await this.noteService.createNote(userId, input);
            res.status(201).json({
                success: true,
                message: "Note created successfully",
                data: note,
            });
        }
        catch (error) {
            if (error.name === "ZodError") {
                res.status(400).json({
                    success: false,
                    message: "Validation error",
                    errors: error.errors,
                });
            }
            else {
                res.status(500).json({
                    success: false,
                    message: error.message || "Failed to create note",
                });
            }
        }
    };
    getNoteById = async (req, res) => {
        try {
            const { id } = req.params;
            const note = await this.noteService.getNoteById(id);
            if (!note) {
                res.status(404).json({
                    success: false,
                    message: "Note not found",
                });
                return;
            }
            res.status(200).json({
                success: true,
                data: note,
            });
        }
        catch (error) {
            res.status(500).json({
                success: false,
                message: error.message || "Failed to get note",
            });
        }
    };
    getMyNotes = async (req, res) => {
        try {
            const userId = req.userId;
            if (!userId) {
                res.status(401).json({
                    success: false,
                    message: "Unauthorized",
                });
                return;
            }
            const notes = await this.noteService.getNotesByAuthorId(userId);
            res.status(200).json({
                success: true,
                data: notes,
                count: notes.length,
            });
        }
        catch (error) {
            res.status(500).json({
                success: false,
                message: error.message || "Failed to get notes",
            });
        }
    };
    getAllNotes = async (req, res) => {
        try {
            const page = parseInt(req.query.page) || 1;
            const limit = parseInt(req.query.limit) || 10;
            const skip = (page - 1) * limit;
            const notes = await this.noteService.getAllNotes(skip, limit);
            res.status(200).json({
                success: true,
                data: notes,
                pagination: {
                    page,
                    limit,
                    total: notes.length,
                },
            });
        }
        catch (error) {
            res.status(500).json({
                success: false,
                message: error.message || "Failed to get notes",
            });
        }
    };
    updateNote = async (req, res) => {
        try {
            const { id } = req.params;
            const input = UpdateNoteSchema.parse(req.body);
            const userId = req.userId;
            if (!userId) {
                res.status(401).json({
                    success: false,
                    message: "Unauthorized",
                });
                return;
            }
            const note = await this.noteService.updateNote(id, userId, input);
            res.status(200).json({
                success: true,
                message: "Note updated successfully",
                data: note,
            });
        }
        catch (error) {
            if (error.name === "ZodError") {
                res.status(400).json({
                    success: false,
                    message: "Validation error",
                    errors: error.errors,
                });
            }
            else if (error.message.includes("Unauthorized")) {
                res.status(403).json({
                    success: false,
                    message: error.message,
                });
            }
            else if (error.message === "Note not found") {
                res.status(404).json({
                    success: false,
                    message: error.message,
                });
            }
            else {
                res.status(500).json({
                    success: false,
                    message: error.message || "Failed to update note",
                });
            }
        }
    };
    deleteNote = async (req, res) => {
        try {
            const { id } = req.params;
            const userId = req.userId;
            if (!userId) {
                res.status(401).json({
                    success: false,
                    message: "Unauthorized",
                });
                return;
            }
            await this.noteService.deleteNote(id, userId);
            res.status(200).json({
                success: true,
                message: "Note deleted successfully",
            });
        }
        catch (error) {
            if (error.message.includes("Unauthorized")) {
                res.status(403).json({
                    success: false,
                    message: error.message,
                });
            }
            else if (error.message === "Note not found") {
                res.status(404).json({
                    success: false,
                    message: error.message,
                });
            }
            else {
                res.status(500).json({
                    success: false,
                    message: error.message || "Failed to delete note",
                });
            }
        }
    };
    searchNotes = async (req, res) => {
        try {
            const { query } = req.query;
            const userId = req.userId;
            if (!userId) {
                res.status(401).json({
                    success: false,
                    message: "Unauthorized",
                });
                return;
            }
            if (!query || typeof query !== "string") {
                res.status(400).json({
                    success: false,
                    message: "Query parameter is required",
                });
                return;
            }
            const notes = await this.noteService.searchNotes(userId, query);
            res.status(200).json({
                success: true,
                data: notes,
                count: notes.length,
            });
        }
        catch (error) {
            res.status(500).json({
                success: false,
                message: error.message || "Failed to search notes",
            });
        }
    };
}
//# sourceMappingURL=note.controller.js.map