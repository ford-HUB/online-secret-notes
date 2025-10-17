import React from "react"
import { Eye, EyeOff } from 'lucide-react';

import { useAuth } from "../../store/useAuthStore";
import { useNavigate } from "react-router-dom";

const LoginPage = () => {
    const { login } = useAuth()
    const navigate = useNavigate()
    const [showPassword, setShowPassword] = React.useState(false);
    const [formData, setFormData] = React.useState({
        email: '',
        password: '',
    });

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };

    const handleLogin = async (e) => {
        e.preventDefault()
        const success = await login(formData)
        if (success) return navigate('/home')
    };

    return (
        <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-4">
            <div className="w-full max-w-md">
                {/* Logo Header */}
                <div className="text-center mb-8">
                    <h1 className="text-5xl font-bold text-blue-600">secret notes</h1>
                    <p className="text-gray-600 mt-1 text-lg">Keep your personal notes secure</p>
                </div>

                {/* Login Card */}
                <div className="bg-white rounded-lg shadow-lg p-6">
                    {/* Email field */}
                    <div className="mb-4">
                        <div className="relative">
                            <input
                                type="email"
                                id="email"
                                name="email"
                                value={formData.email}
                                onChange={handleInputChange}
                                className="w-full py-3 px-4 bg-gray-50 border border-gray-300 rounded-md text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                placeholder="Email or phone number"
                            />
                        </div>
                    </div>

                    {/* Password field */}
                    <div className="mb-4">
                        <div className="relative">
                            <input
                                type={showPassword ? "text" : "password"}
                                id="password"
                                name="password"
                                value={formData.password}
                                onChange={handleInputChange}
                                className="w-full py-3 px-4 bg-gray-50 border border-gray-300 rounded-md text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                placeholder="Password"
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-500 hover:text-gray-800"
                            >
                                {showPassword ? (
                                    <EyeOff className="h-5 w-5" />
                                ) : (
                                    <Eye className="h-5 w-5" />
                                )}
                            </button>
                        </div>
                    </div>

                    {/* Login button */}
                    <button
                        onClick={handleLogin}
                        className="w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-md transition duration-200 text-lg"
                    >
                        Log In
                    </button>

                    {/* Forgot password */}
                    <div className="mt-4 text-center">
                        <a href="#" className="text-blue-600 hover:underline text-sm">
                            Forgotten password?
                        </a>
                    </div>

                    <div className="my-4 flex items-center">
                        <div className="flex-grow border-t border-gray-300"></div>
                        <span className="mx-4 text-gray-500 text-sm">or</span>
                        <div className="flex-grow border-t border-gray-300"></div>
                    </div>

                    {/* Create new account button */}
                    <div className="flex justify-center">
                        <a href="/signup">
                            <button
                                className="py-2 px-4 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-md transition duration-200"
                            >
                                Create new account
                            </button>
                        </a>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default LoginPage