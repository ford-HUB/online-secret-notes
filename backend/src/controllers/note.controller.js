import { pool } from "../config/db.js";

export const addNote = async (req, res) => {
    try {
        const user_id = req.user.id
        const { cat_id } = req.params

        if (!user_id || !cat_id) { return res.json({ success: false, message: 'user ID and category_id Not Found' }) }

        const { title, content_container } = req.body

        const attemptInsert = await pool.query('SELECT add_notes($1, $2, $3, $4) AS response', [title, content_container, user_id, cat_id])

        const isSuccess = attemptInsert.rows[0].response
        if (!isSuccess) { return res.json({ success: false, message: 'add notes failed to add' }) }

        res.json({ success: true, message: isSuccess })

    } catch (error) {
        console.log('add note controller fails', error.message)
        res.status(500).json({ success: false, message: 'Internal Server Error' })
    }
}

export const getAllNotesByCategoryId = async (req, res) => {
    try {
        const user_id = req.user.id
        const { cat_id } = req.params

        if (!user_id || !cat_id) { return res.json({ success: false, message: 'user ID and category_id Not Found' }) }

        const attemptGet = await pool.query('SELECT * FROM get_all_notes_by_category($1, $2)', [user_id, cat_id])
        const allNotes = attemptGet.rows

        if (!allNotes) { return res.json({ success: false, message: 'notes is failed to get the data' }) }

        res.json({ success: true, data: allNotes })

    } catch (error) {
        console.log('get all notes by category controller fails', error.message)
        res.status(500).json({ success: false, message: 'Internal Server Error' })
    }
}

export const getAllUserNotes = async (req, res) => {
    try {
        const userId = req.user.id

        if (!userId) { return res.json({ success: false, message: 'user ID and category_id Not Found' }) }

        const attemptGet = await pool.query('SELECT * FROM get_all_user_notes($1)', [userId])
        const allNotes = attemptGet.rows

        if (!allNotes) { return res.json({ success: false, message: 'notes is failed to get the data' }) }

        res.json({

            success: true,
            data: allNotes.map(note => ({
                notes_id: note.notes_id,
                title: note.title,
                content_container: note.content_container,
                category_name: note.category_name,
                ispin: note.ispin,
                createdat: note.createdat,
                updatedat: note.updatedat
            }))
        })

    } catch (error) {
        console.log('get all notes controller fails', error.message)
        res.status(500).json({ success: false, message: 'Internal Server Error' })
    }
}

export const updateChangesNotes = async (req, res) => {
    try {
        const userId = req.user.id
        const { cat_id, note_id } = req.params

        const { title, updatedText } = req.body

        const getSpecificNote = await pool.query('SELECT title, content_container FROM notes WHERE user_id = $1 AND cat_id = $2 AND notes_id = $3', [userId, cat_id, note_id])

        const getTitle = getSpecificNote.rows[0].title;
        const getContentContainer = getSpecificNote.rows[0].content_container

        if (!getTitle || !getContentContainer) {
            return res.json({ success: false, message: 'Note Data Not Found' });
        }

        if (getTitle !== title) {

            await pool.query('UPDATE notes SET title = $1 WHERE user_id = $2 AND cat_id = $3 AND notes_id = $4', [title, userId, cat_id, note_id])
            return res.json({ success: true, message: 'title is a successfully updated' })
        }

        if (getContentContainer !== updatedText) {
            const AttemptUpdateChange = await pool.query('SELECT update_changes_note($1, $2)', [getContentContainer, updatedText])
            if (!AttemptUpdateChange) { return res.json({ success: false, message: 'not successfully updated' }) }

            res.json({ success: true, message: 'note successfully updated' })
        }

        res.json({ success: false, message: 'There is no chanages detected' })


    } catch (error) {
        console.log('updateChangesNotes controller fails', error.message)
        res.status(500).json({ success: false, message: 'Internal Server Error' })
    }
}

export const deleteNoteById = async (req, res) => {
    try {
        const userId = req.user.id
        const { note_id } = req.params

        const attemptDelete = await pool.query('SELECT delete_note_by_id($1, $2)', [userId, note_id])
        const isSuccess = attemptDelete.rows[0].delete_note_by_id
        if (isSuccess !== 'Data Successfully Deleted') { return res.json({ success: false, message: 'data failed to delete' }) }

        res.json({ success: true, message: isSuccess })


    } catch (error) {
        console.log('delete controller fails', error.message)
        res.status(500).json({ success: false, message: 'Internal Server Error' })
    }
}

