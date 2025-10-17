import { pool } from '../config/db.js'
import bcrypt from 'bcryptjs'
import { generateToken } from '../utils/generateToken.js'

export const signup = async (req, res) => {
    try {
        const { username, email, password } = req.body

        let salt = await bcrypt.genSalt(10)
        const hashPassword = await bcrypt.hash(password, salt)

        const attemptInsert = await pool.query(
            'SELECT register_user($1, $2, $3) AS response', [username, email, hashPassword]
        )

        const isSuccess = attemptInsert.rows[0].response

        if (isSuccess === -1) { return res.json({ success: false, message: 'email is already exist' }) }

        generateToken(isSuccess, res)
        res.json({ success: true, userId: isSuccess, message: 'Successfully Registered' })

    } catch (error) {
        console.log('sign up controller failed', error.message)
        res.json({ success: false, message: 'Internal Server Error' })
    }
}

export const login = async (req, res) => {
    try {
        const { email, password } = req.body

        const getUser = await pool.query('SELECT * FROM users WHERE email = $1', [email])

        let user = getUser.rows[0]

        if (!user) { return res.json({ success: false, message: 'Invalid Credentials' }) }

        const isPasswordValid = await bcrypt.compare(password, user.password)

        if (!isPasswordValid) { return res.json({ success: false, message: 'Invalid Credentials' }) }

        generateToken(user.id, res)

        res.json({ success: true, message: 'Successfully LoggedIn' })



    } catch (error) {
        console.log('login controller failed', error.message)
        res.json({ success: false, message: 'Internal Server Error' })
    }
}

export const logout = (req, res) => {
    try {
        res.clearCookie('token', {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'development',
            sameSite: 'strict',
        })

        res.json({ success: true, message: 'Loggout Successfully' })
    } catch (error) {
        console.log('log out controller fails', error.message)
        res.json({ success: false, message: 'Internal Server Error' })
    }
}

export const updateProfile = async (req, res) => {
    try {
        const userId = req.user.id
        const { username, password, confirmPassword } = req.body

        if (password && password !== confirmPassword) {
            return res.json({ success: false, message: 'Password and confirm password do not match' })
        }

        const attemptGet = await pool.query('SELECT username FROM users WHERE id = $1', [userId])
        const user = attemptGet.rows[0];

        if (!user) {
            return res.json({ success: false, message: 'User not found' })
        }

        const shouldUpdateUsername = username && username !== user.username
        const shouldUpdatePassword = password && confirmPassword;

        let hashedPassword = null
        if (shouldUpdatePassword) {
            const salt = await bcrypt.genSalt(10)
            hashedPassword = await bcrypt.hash(confirmPassword, salt)
        }
        if (shouldUpdateUsername || shouldUpdatePassword) {
            const result = await pool.query(
                'SELECT update_user($1, $2, $3)',
                [userId, shouldUpdateUsername ? username : null, shouldUpdatePassword ? hashedPassword : null]
            );

            if (result.rows[0].update_user !== 'User updated successfully') {
                return res.json({ success: false, message: 'User failed to update' })
            }

            return res.json({ success: true, message: 'Your account was successfully updated' })
        }

        return res.json({ success: false, message: 'No changes detected' });

    } catch (error) {
        console.log('update profile controller fails', error.message);
        res.status(500).json({ success: false, message: 'Internal Server Error' })
    }
};


export const checkAuth = (req, res) => {
    try {
        const user = req.user
        res.json({ success: true, user: user })
    } catch (error) {
        console.log('check auth controller fails', error.message)
        res.json({ success: false, message: 'Internal Server Error' })
    }
}