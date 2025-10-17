import React from 'react'
import { Eye, EyeOff } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../store/useAuthStore';

const SignupPage = () => {
    const { signup, isSignup } = useAuth()
    const navigate = useNavigate(); // ← hook here
    const [showPassword, setShowPassword] = React.useState(false);
    const [formData, setFormData] = React.useState({
        username: '',
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

    const handleRegister = async (e) => {
        e.preventDefault()
        const success = await signup(formData)
        if (success) return navigate('/login')

    };




    return (
        <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-4">
            <div className="w-full max-w-md">
                {/* Logo Header */}
                <div className="text-center mb-8">
                    <h1 className="text-5xl font-bold text-blue-600">secret notes</h1>
                    <p className="text-gray-600 mt-1">Join Secret Notes to manage your personal notes</p>
                </div>

                {/* Register Card */}
                <div className="bg-white rounded-lg shadow-lg p-6">
                    <h2 className="text-xl font-semibold text-gray-800 mb-4">Create a new account</h2>
                    <p className="text-gray-600 mb-4">It's quick and easy.</p>

                    <div className="border-t border-gray-300 mb-4"></div>

                    {/* Name fields */}
                    <div className="flex gap-2 mb-3">
                        <div className="flex-1">
                            <input
                                type="text"
                                id="username"
                                name="username"
                                value={formData.username}
                                onChange={handleInputChange}
                                className="w-full py-2 px-3 bg-gray-50 border border-gray-300 rounded-md text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                placeholder="Username"
                            />
                        </div>
                    </div>

                    {/* Email field */}
                    <div className="mb-3">
                        <input
                            type="email"
                            id="register-email"
                            name="email"
                            value={formData.email}
                            onChange={handleInputChange}
                            className="w-full py-2 px-3 bg-gray-50 border border-gray-300 rounded-md text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            placeholder="Email address"
                        />
                    </div>

                    {/* Password field */}
                    <div className="mb-3">
                        <div className="relative">
                            <input
                                type={showPassword ? "text" : "password"}
                                id="register-password"
                                name="password"
                                value={formData.password}
                                onChange={handleInputChange}
                                className="w-full py-2 px-3 bg-gray-50 border border-gray-300 rounded-md text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                placeholder="New password"
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

                    {/* Terms acceptance text */}
                    <p className="text-xs text-gray-600 mb-4">
                        By clicking Sign Up, you agree to our Terms, Privacy Policy and Cookies Policy.
                    </p>

                    {/* Sign up button */}
                    <div className="flex justify-center">
                        <button
                            onClick={handleRegister}
                            className="py-2 px-12 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-md transition duration-200 text-lg"
                        >
                            Sign Up
                        </button>
                    </div>

                    {/* Login link */}
                    <div className="mt-4 text-center">
                        <a href="/login" className="text-blue-600 hover:underline">
                            Already have an account?
                        </a>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default SignupPage