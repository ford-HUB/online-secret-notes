import express from 'express'

// @ Imported From Controller
import { addCategory, getCategory, deleteCategory } from '../controllers/category.controller.js'

// @ Middleware
import { verifyToken } from '../middleware/verifyToken.js'
import { validateRequest } from '../middleware/validateRequest.js'

// @Schema
import { catSchema } from '../schemas/categorySchema.js'

const CatRoutes = express.Router()

CatRoutes.post('/add-category', validateRequest(catSchema), verifyToken, addCategory)
CatRoutes.get('/get-categorys', verifyToken, getCategory)
CatRoutes.delete('/delete-category/:cat_id/:note_id/content', verifyToken, deleteCategory)



export default CatRoutes