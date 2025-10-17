import { create } from "zustand"
import { apiInstance } from "../api/base"
import toast from "react-hot-toast"
import { data } from "react-router-dom"

export const useNoteStore = create((set) => ({
    ListNotes: [],

    getAllNotes: async () => {
        try {
            const response = await apiInstance.get('/your-notes/get-all-notes')
            if (!response.data.success) { return set({ ListNotes: [] }), false }
            set({ ListNotes: response.data.data })
            return true
        } catch (error) {
            console.log('get note fails', error.message)
            set({ ListNotes: [] })
            return false;
        }
    },

    addNotes: async (data) => {
        try {
            const response = await apiInstance.post(`/your-notes/add-note/${data.cat_id}`, { title: data.title, content_container: data.content })
            if (!response.data.success) { return toast.error(response.data.message), false }
            toast.success(response.data.message)
            return true
        } catch (error) {
            console.log('get note fails', error.message)
            set({ ListNotes: [] })
            return false;
        }
    },

    updateNoteExisting: async (data) => {
        try {
            const response = await apiInstance.put(`/your-notes/edit/${data.cat_id}/${data.note_id}/content`, { title: data.title, updatedText: data.content })
            if (!response.data.success) { return toast.error(response.data.message), false }
            toast.success(response.data.message)
            return true
        } catch (error) {
            console.log('get note fails', error.message)
            set({ ListNotes: [] })
            return false;
        }
    },

    deleteNote: async (id) => {
        try {
            const response = await apiInstance.delete(`/your-notes/delete/${id.note_id}/content`)
            if (!response.data.success) { return toast.error(response.data.message), false }
            toast.success(response.data.message)
            return true
        } catch (error) {
            console.log('get note fails', error.message)
            set({ ListNotes: [] })
            return false;
        }
    }



}))