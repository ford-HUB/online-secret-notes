import { create } from "zustand"
import { apiInstance } from "../api/base"
import toast from "react-hot-toast"

export const useCategories = create((set) => ({
    ListCategories: [],

    checkCategories: async () => {
        try {
            const response = await apiInstance.get('/category/get-categorys')

            if (!response.data.success) { return set({ ListCategories: [] }), false }

            set({ ListCategories: response.data.data })
            return true
        } catch (error) {
            console.log('check categories failed', error.message)
            set({ ListCategories: null })
            return false
        }
    },

    addCategories: async (data) => {
        try {
            const response = await apiInstance.post('/category/add-category', { category_name: data })
            if (!response.data.success) { return toast.error(response.data.message), false }
            toast.success(response.data.message)
            return true

        } catch (error) {
            console.log('add categories failed', error.message)
            return false
        }
    }

}))