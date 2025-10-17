import React from "react"
import { Routes, Route } from "react-router-dom"
import { useAuth } from "./store/useAuthStore"

// @Imported Pages
import LoginPage from "./pages/auth/LoginPage"
import SignupPage from "./pages/auth/SignupPage"
import ProtectedRoute from "./utils/ProtectedRoute"
import NotFound from "./pages/errors/NotFound"
import HomePage from "./pages/home/HomePage"


const App = () => {
  const { checkAuth, userAuth } = useAuth()

  React.useEffect(() => {
    const init = async () => {
      await checkAuth()
    }
    init()
  }, [])




  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/signup" element={<SignupPage />} />

      <Route path="/home" element={<ProtectedRoute>
        <HomePage />
      </ProtectedRoute>} />


      <Route path="*" element={<NotFound />} />

    </Routes>
  )
}

export default App