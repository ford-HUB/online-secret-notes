import express from 'express'

// @ Middlewares
import { validateRequest } from '../middleware/validateRequest.js'
import { verifyToken } from '../middleware/verifyToken.js'

// @ Joi Schema
import { registerBody } from '../schemas/userSchema.js'
import { loginBody } from '../schemas/userSchema.js'

// @ Controllers
import { signup, login, logout, checkAuth, updateProfile } from '../controllers/auth.controller.js'

const authRoutes = express.Router()

authRoutes.post('/signup', validateRequest(registerBody), signup)
authRoutes.post('/login', validateRequest(loginBody), login)
authRoutes.post('/logout', logout)
authRoutes.get('/checkAuth', verifyToken, checkAuth)
authRoutes.put('/update-profile', verifyToken, updateProfile)




export default authRoutes
