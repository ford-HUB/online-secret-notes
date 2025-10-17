import express from "express"

// @Validator Request
import { validateRequest } from "../middleware/validateRequest.js"

// @Middleware Verify Token
import { verifyToken } from "../middleware/verifyToken.js"

// @ note schema
import { noteSchema } from "../schemas/noteSchema.js"

// @ Imported From Controller
import { addNote, getAllNotesByCategoryId, getAllUserNotes, updateChangesNotes, deleteNoteById } from "../controllers/note.controller.js"

const noteRoutes = express.Router()

noteRoutes.post('/add-note/:cat_id', validateRequest(noteSchema), verifyToken, addNote)
noteRoutes.get('/get-note/:cat_id', verifyToken, getAllNotesByCategoryId)
noteRoutes.get('/get-all-notes', verifyToken, getAllUserNotes)
noteRoutes.put('/edit/:cat_id/:note_id/content', verifyToken, updateChangesNotes)
noteRoutes.delete('/delete/:note_id/content', verifyToken, deleteNoteById)

export default noteRoutes