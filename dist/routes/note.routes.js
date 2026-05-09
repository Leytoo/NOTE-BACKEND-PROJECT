import express from "express";
import { NoteController } from "../controllers/note.controller";
import { authenticateToken } from "../middlewares/auth.middleware";
const router = express.Router();
const noteController = new NoteController();
// Protected routes (require authentication) - must come before parameterized routes
router.post("/", authenticateToken, noteController.createNote);
router.get("/my-notes", authenticateToken, noteController.getMyNotes);
router.get("/search", authenticateToken, noteController.searchNotes);
router.put("/:id", authenticateToken, noteController.updateNote);
router.delete("/:id", authenticateToken, noteController.deleteNote);
// Public routes - parameterized routes last
router.get("/", noteController.getAllNotes);
router.get("/:id", noteController.getNoteById);
export default router;
//# sourceMappingURL=note.routes.js.map