import express from 'express'
import cookieParser from 'cookie-parser'
import cors from 'cors'

const app = express()

// @ Routes
import authRoutes from './routes/authRoutes.js'
import CatRoutes from './routes/categoryRoutes.js'
import noteRoutes from './routes/noteRoutes.js'

// @ Middleware
app.use(cors({
    origin: [process.env.VITE_FRONTEND_URL, 'http://localhost:5173'],
    credentials: true
}))
app.use(express.json())
app.use(cookieParser())




app.use('/api/auth', authRoutes)
app.use('/api/category', CatRoutes)
app.use('/api/your-notes', noteRoutes)

export default app
