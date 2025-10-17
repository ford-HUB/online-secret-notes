import { Pool } from 'pg'
import dotenv from 'dotenv'

dotenv.config() // prior to load kasi nag e-error si gagooo

// @defining our connection postgres
export const pool = new Pool({
    user: process.env.POSTGRES_DATABASE_USER,
    host: 'localhost',
    database: process.env.POSTGRES_DATABASE,
    password: process.env.POSTGRES_PASSWORD,
    port: process.env.DB_PORT
})

export const checkConnection = async () => {
    // Test the connection
    pool.query('SELECT NOW()', (err, res) => {
        if (err) {
            console.error('Database connection error:', err.stack);
        } else {
            console.log('Database connected successfully at:', res.rows[0].now);
        }
    });
}