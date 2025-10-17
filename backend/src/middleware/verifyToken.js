import jwt from 'jsonwebtoken'
import { pool } from '../config/db.js'

export const verifyToken = async (req, res, next) => {
    try {
        const requestToken = req.cookies.token

        if (!requestToken) { return res.json({ success: false, message: 'Token Not Provided' }) }

        // @ debugging purpose
        // console.log('token', requestToken)

        const decoded = jwt.verify(requestToken, process.env.MY_SECRET_KEY)

        const getUser = await pool.query('SELECT id, username, email FROM users WHERE id = $1', [decoded.id])

        if (getUser.rows.length === 0) { return res.json({ success: false, message: 'user not found' }) }

        req.user = getUser.rows[0]

        next()

    } catch (error) {
        console.log('verify middleware fails', error.message)
        res.json({ success: false, message: 'Internal Server Error' })
    }
}