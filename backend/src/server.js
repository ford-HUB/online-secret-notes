import app from "./app.js"
import dotenv from 'dotenv'
import { checkConnection } from "./config/db.js"
dotenv.config()
checkConnection()
const PORT = process.env.PORT || 3000

app.listen(PORT, () => {
    console.log(`server is running at http://localhost:${PORT}`)
})