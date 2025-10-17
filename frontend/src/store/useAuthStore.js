import { create } from "zustand"
import toast from "react-hot-toast"

import { apiInstance } from "../api/base.js"

export const useAuth = create((set) => ({
    userAuth: null,
    isLoggedIn: false,

    checkAuth: async () => {
        try {
            const response = await apiInstance.get(`/auth/checkAuth`)
            set({
                userAuth: response.data.user,
                isLoggedIn: true
            })
        } catch (error) {
            console.log('check auth failed', error.message)
            set({
                userAuth: null,
                isLoggedIn: false
            })
        }
    },

    login: async (formData) => {
        try {
            const response = await apiInstance.post('/auth/login', formData)
            if (!response.data.success) { return toast.error(response.data.message), set({ isLoggedIn: false }), false }
            toast.success(response.data.message)
            set({ isLoggedIn: true })
            return true

        } catch (error) {
            console.log('check auth failed', error.message)
            set({ isLoggedIn: false })
        }
    },

    signup: async (formData) => {
        try {
            const response = await apiInstance.post('/auth/signup', formData)
            if (!response.data.success) { return toast.error(response.data.message), false }
            toast.success(response.data.message)
            return true

        } catch (error) {
            console.log('sign up failed', error.message)
        }
    },

    logout: async () => {
        try {
            const response = await apiInstance.post('/auth/logout')
            if (!response.data.success) { return toast.error('Failed to logout'), false }
            toast.success(response.data.message)
            return true
        } catch (error) {
            console.log('logout failed', error.message)
        }
    },

    updateUser: async (data) => {
        try {
            const response = await apiInstance.put('/auth/update-profile', { username: data.username, email: data.email, password: data.password, confirmPassword: data.confirmPassword })
            if (!response.data.success) { return toast.error('Failed to logout'), false }
            toast.success(response.data.message)
            return true
        } catch (error) {
            console.log('logout failed', error.message)
        }
    }
}))
