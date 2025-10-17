import jwt from 'jsonwebtoken'

export const generateToken = (user_id, res) => {
    const token = jwt.sign({ id: user_id }, process.env.MY_SECRET_KEY, { expiresIn: '1hr' })

    res.cookie('token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'development', // Only send over HTTPS in production
        sameSite: 'Strict',
        maxAge: 60 * 60 * 1000 // 1 hour in milliseconds
    })

}