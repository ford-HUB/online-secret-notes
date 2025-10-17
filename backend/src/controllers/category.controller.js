import { pool } from "../config/db.js"

export const addCategory = async (req, res) => {
    try {
        const user_id = req.user.id
        const { category_name } = req.body

        const attemptInsert = await pool.query('INSERT INTO category (user_id, category_name) VALUES ($1, $2) RETURNING category_name', [user_id, category_name])
        const isSuccess = attemptInsert.rows[0]

        if (!isSuccess) { return res.json({ success: false, message: 'category failed to add' }) }

        res.json({ success: true, data: isSuccess, message: 'category successfully added' })


    } catch (error) {
        console.log('add category controller fails', error.message)
        res.json({ success: false, message: 'Internal Server Error' })
    }
}

export const getCategory = async (req, res) => {
    try {
        const user_id = req.user.id;

        const attemptGet = await pool.query(
            'SELECT cat_id, category_name FROM category WHERE user_id = $1',
            [user_id]
        );

        const getCategory = attemptGet.rows;

        if (getCategory.length === 0) {
            return res.json({
                success: false,
                message: 'No categories found for this user',
            });
        }

        res.json({
            success: true,
            data: getCategory.map(category => ({
                cat_id: category.cat_id,
                category_name: category.category_name
            })),

            message: 'Categories successfully nga nakuha'
        })
    } catch (error) {
        console.log('get category controller fails', error.message);
        res.status(500).json({ success: false, message: 'Internal Server Error' })
    }
}

export const deleteCategory = async (req, res) => {
    try {
        const userId = req.user.id
        const { cat_id, note_id } = req.params

        const attemptDelete = await pool.query('SELECT delete_category_by_id($1, $2, $3)', [userId, cat_id, note_id])
        const isSuccess = attemptDelete.rows[0].delete_category_by_id
        if (isSuccess !== 'Data Successfully Deleted') { return res.json({ success: false, message: 'data failed to delete' }) }

        res.json({ success: true, message: isSuccess })

    } catch (error) {
        console.log('delete category controller fails', error.message);
        res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
}


