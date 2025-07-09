import React, { useEffect, useState } from 'react';
import { Eye, EyeOff, MessageCircle, Mail, Lock, User, ArrowRight } from 'lucide-react';
import axiosinstance from '../axios/axios';
import toast from 'react-hot-toast';

const AuthPages = () => {
            const [isLogin, setIsLogin] = useState(() => {
                        const saved = localStorage.getItem("isLogin");
                        return saved === "true"
            });
            const [showPassword, setShowPassword] = useState(false);
            const [showConfirmPassword, setShowConfirmPassword] = useState(false);
            const [formData, setFormData] = useState({
                        username: '',
                        email: '',
                        password: '',
                        confirmPassword: ''
            });
            const [errors, setErrors] = useState({});
            const [isLoading, setIsLoading] = useState(false);

            const handleInputChange = (e) => {
                        const { name, value } = e.target;
                        setFormData(prev => ({ ...prev, [name]: value }));
                        // Clear error when user starts typing
                        if (errors[name]) {
                                    setErrors(prev => ({ ...prev, [name]: '' }));
                        }
            };

            const validateForm = () => {
                        const newErrors = {};

                        if (!isLogin && !formData.username.trim()) {
                                    newErrors.username = 'username is required';
                        }

                        if (!formData.email.trim()) {
                                    newErrors.email = 'Email is required';
                        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
                                    newErrors.email = 'Please enter a valid email';
                        }

                        if (!formData.password) {
                                    newErrors.password = 'Password is required';
                        } else if (formData.password.length < 6) {
                                    newErrors.password = 'Password must be at least 6 characters';
                        }

                        if (!isLogin && !formData.confirmPassword) {
                                    newErrors.confirmPassword = 'Please confirm your password';
                        } else if (!isLogin && formData.password !== formData.confirmPassword) {
                                    newErrors.confirmPassword = 'Passwords do not match';
                        }

                        return newErrors;
            };

            const handleSubmit = async (e) => {
                        e.preventDefault();
                        const newErrors = validateForm();

                        if (Object.keys(newErrors).length > 0) {
                                    setErrors(newErrors);
                                    return;
                        }

                        try {
                                    setIsLoading(true);
                                    // Simulate API call

                                    const logValue = isLogin ? "login" : "register"

                                    console.log(logValue)
                                    const { data } = await axiosinstance.post(`/api/auth/${logValue}`, formData);
                                    setIsLoading(false);

                                    toast.success(data.message)
                                    console.log(data)
                                    // Handle successful submission here
                                    console.log('Form submitted:', formData);
                        } catch (error) {
                                    console.log(error)
                                    toast.error(error.response.data.message);
                                    setIsLoading(false);
                        }
            };

            useEffect(() => {
                        localStorage.setItem("isLogin", isLogin)
            }, [isLogin])
            const toggleMode = () => {
                        setIsLogin(!isLogin);
                        setFormData({
                                    username: '',
                                    email: '',
                                    password: '',
                                    confirmPassword: ''
                        });
                        setErrors({});
            };

            return (
                        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100   p-4 ">
                                    <div className='md:flex md:items-center justify-center  md:h-[90vh]'>
                                                <div className="text-center mb-8 lg:w-1/2  w-full ">
                                                            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl mb-4 shadow-lg">
                                                                        <MessageCircle className="w-8 h-8 text-white" />
                                                            </div>
                                                            <h1 className="text-3xl font-bold text-gray-900 mb-2">
                                                                        {isLogin ? 'Welcome Back' : 'Join Us'}
                                                            </h1>
                                                            <p className="text-gray-600">
                                                                        {isLogin ? 'Sign in to continue your conversations' : 'Create your account to get started'}
                                                            </p>
                                                </div>
                                                <div className="w-full max-w-md ">
                                                            {/* Header */}


                                                            {/* Form Container */}
                                                            <div className="bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden">
                                                                        <div className="p-8">
                                                                                    <form onSubmit={handleSubmit} className="space-y-6">
                                                                                                {/* username Field (Register Only) */}
                                                                                                {!isLogin && (
                                                                                                            <div className="space-y-2">
                                                                                                                        <label htmlFor="username" className="block text-sm font-medium text-gray-700">
                                                                                                                                    Full username
                                                                                                                        </label>
                                                                                                                        <div className="relative">
                                                                                                                                    <User className="absolute left-3 top-3.5 h-5 w-5 text-gray-400" />
                                                                                                                                    <input
                                                                                                                                                type="text"
                                                                                                                                                id="username"
                                                                                                                                                name="username"
                                                                                                                                                value={formData.username}
                                                                                                                                                onChange={handleInputChange}
                                                                                                                                                className={`w-full pl-11 pr-4 py-3.5 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 ${errors.username ? 'border-red-300 bg-red-50' : 'border-gray-300 bg-gray-50'
                                                                                                                                                            }`}
                                                                                                                                                placeholder="Enter your full username"
                                                                                                                                    />
                                                                                                                        </div>
                                                                                                                        <div className='h-2'>
                                                                                                                                    {errors.username && <p className="text-red-600 text-sm mt-1">{errors.username}</p>}
                                                                                                                        </div>
                                                                                                            </div>
                                                                                                )}

                                                                                                {/* Email Field */}
                                                                                                <div className="space-y-2">
                                                                                                            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                                                                                                                        Email Address
                                                                                                            </label>
                                                                                                            <div className="relative">
                                                                                                                        <Mail className="absolute left-3 top-3.5 h-5 w-5 text-gray-400" />
                                                                                                                        <input
                                                                                                                                    type="email"
                                                                                                                                    id="email"
                                                                                                                                    name="email"
                                                                                                                                    value={formData.email}
                                                                                                                                    onChange={handleInputChange}
                                                                                                                                    className={`w-full pl-11 pr-4 py-3.5 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 ${errors.email ? 'border-red-300 bg-red-50' : 'border-gray-300 bg-gray-50'
                                                                                                                                                }`}
                                                                                                                                    placeholder="Enter your email"
                                                                                                                        />
                                                                                                            </div>
                                                                                                            <div className='h-2'>
                                                                                                                        {errors.email && <p className="text-red-600 text-sm mt-1">{errors.email}</p>}
                                                                                                            </div>
                                                                                                </div>

                                                                                                {/* Password Field */}
                                                                                                <div className="space-y-2">
                                                                                                            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                                                                                                                        Password
                                                                                                            </label>
                                                                                                            <div className="relative">
                                                                                                                        <Lock className="absolute left-3 top-3.5 h-5 w-5 text-gray-400" />
                                                                                                                        <input
                                                                                                                                    type={showPassword ? 'text' : 'password'}
                                                                                                                                    id="password"
                                                                                                                                    name="password"
                                                                                                                                    value={formData.password}
                                                                                                                                    onChange={handleInputChange}
                                                                                                                                    className={`w-full pl-11 pr-12 py-3.5 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 ${errors.password ? 'border-red-300 bg-red-50' : 'border-gray-300 bg-gray-50'
                                                                                                                                                }`}
                                                                                                                                    placeholder="Enter your password"
                                                                                                                        />
                                                                                                                        <button
                                                                                                                                    type="button"
                                                                                                                                    onClick={() => setShowPassword(!showPassword)}
                                                                                                                                    className="absolute right-3 top-3.5 text-gray-400 hover:text-gray-600"
                                                                                                                        >
                                                                                                                                    {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                                                                                                                        </button>
                                                                                                            </div>
                                                                                                            <div className='h-2'>
                                                                                                                        {errors.password && <p className="text-red-600 text-sm mt-1">{errors.password}</p>}
                                                                                                            </div>
                                                                                                </div>

                                                                                                {/* Confirm Password Field (Register Only) */}
                                                                                                {!isLogin && (
                                                                                                            <div className="space-y-2">
                                                                                                                        <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
                                                                                                                                    Confirm Password
                                                                                                                        </label>
                                                                                                                        <div className="relative">
                                                                                                                                    <Lock className="absolute left-3 top-3.5 h-5 w-5 text-gray-400" />
                                                                                                                                    <input
                                                                                                                                                type={showConfirmPassword ? 'text' : 'password'}
                                                                                                                                                id="confirmPassword"
                                                                                                                                                name="confirmPassword"
                                                                                                                                                value={formData.confirmPassword}
                                                                                                                                                onChange={handleInputChange}
                                                                                                                                                className={`w-full pl-11 pr-12 py-3.5 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 ${errors.confirmPassword ? 'border-red-300 bg-red-50' : 'border-gray-300 bg-gray-50'
                                                                                                                                                            }`}
                                                                                                                                                placeholder="Confirm your password"
                                                                                                                                    />
                                                                                                                                    <button
                                                                                                                                                type="button"
                                                                                                                                                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                                                                                                                                className="absolute right-3 top-3.5 text-gray-400 hover:text-gray-600"
                                                                                                                                    >
                                                                                                                                                {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                                                                                                                                    </button>
                                                                                                                        </div>
                                                                                                                        <div className='h-2'>
                                                                                                                                    {errors.confirmPassword && <p className="text-red-600 text-sm mt-1">{errors.confirmPassword}</p>}
                                                                                                                        </div>
                                                                                                            </div>
                                                                                                )}

                                                                                                {/* Forgot Password Link (Login Only) */}
                                                                                                {isLogin && (
                                                                                                            <div className="flex justify-end">
                                                                                                                        <button
                                                                                                                                    type="button"
                                                                                                                                    className="text-blue-600 hover:text-blue-800 text-sm font-medium transition-colors"
                                                                                                                        >
                                                                                                                                    Forgot Password?
                                                                                                                        </button>
                                                                                                            </div>
                                                                                                )}

                                                                                                {/* Submit Button */}
                                                                                                <button
                                                                                                            type="submit"
                                                                                                            disabled={isLoading}
                                                                                                            className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-3.5 rounded-xl font-semibold hover:from-blue-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-200 flex items-center justify-center group disabled:opacity-50 disabled:cursor-not-allowed"
                                                                                                >
                                                                                                            {isLoading ? (
                                                                                                                        <div className="flex items-center">
                                                                                                                                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                                                                                                                                    {isLogin ? 'Signing In...' : 'Creating Account...'}
                                                                                                                        </div>
                                                                                                            ) : (
                                                                                                                        <div className="flex items-center">
                                                                                                                                    {isLogin ? 'Sign In' : 'Create Account'}
                                                                                                                                    <ArrowRight className="ml-2 h-5 w-5 transform group-hover:translate-x-1 transition-transform" />
                                                                                                                        </div>
                                                                                                            )}
                                                                                                </button>
                                                                                    </form>

                                                                                    <div className=" py-1 border-t border-gray-100 ">
                                                                                                <div className="text-center">
                                                                                                            <p className="text-gray-600 ">
                                                                                                                        {isLogin ? "Don't have an account?" : 'Already have an account?'}
                                                                                                            </p>
                                                                                                            <button
                                                                                                                        onClick={toggleMode}
                                                                                                                        className="text-blue-600 hover:text-blue-800 font-semibold transition-colors"
                                                                                                            >
                                                                                                                        {isLogin ? 'Sign up for free' : 'Sign in instead'}
                                                                                                            </button>
                                                                                                </div>
                                                                                    </div>
                                                                        </div>
                                                            </div>

                                                </div>

                                    </div>
                                    {/* Toggle Section */}


                                    {/* Footer */}
                                    <div className="text-center mt-1 text-sm text-gray-500">
                                                <p>By continuing, you agree to our Terms of Service and Privacy Policy</p>
                                    </div>
                        </div>
            );
};

export default AuthPages;