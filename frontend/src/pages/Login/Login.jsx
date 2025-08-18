import React, { useState } from 'react';
import { FaEnvelope, FaLock, FaEye, FaEyeSlash, FaUser, FaGlobe } from 'react-icons/fa';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { setLanguage } from '../../features/languageSelector/languageSlice';
import { setRegister } from '../../features/onboarding/registrationSlice';

const Login = () => {
    const [showPassword, setShowPassword] = useState(false);
    const [rememberMe, setRememberMe] = useState(false);
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { t, i18n } = useTranslation();
    const lang = useSelector((state) => state.i18n.lang);
    const [loading, setLoading] = useState(false);


    const [formData, setFormData] = useState({
        fullname: '',
        email: '',
        password: '',
        rememberMe: false
    })
    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value })

    }
    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const userRes = await axios.post(`${import.meta.env.VITE_API_URL}/api/login`, formData);
            toast.success(userRes.data.message);
            if (userRes.status === 200) {
                if (formData.rememberMe) {
                    localStorage.setItem('token', userRes.data.token);
                    localStorage.setItem('userId', userRes.data.safeUser._id); //userId
                } else {
                    sessionStorage.setItem('token', userRes.data.token);
                    localStorage.setItem('userId', userRes.data.safeUser._id);// userId
                }
                dispatch(setRegister({
                    fullname: userRes.data.safeUser.fullname,
                    email: userRes.data.safeUser.email
                }));

                // Navigate based on login steps
                if (userRes.data.loginStepsCompleted) {
                    navigate('/dashboard')
                }
                // Redirect to account page after successful signup/login
                else {
                    navigate('/login-steps/account');
                }
            }
        }
        catch (error) {
            toast.error(error?.response?.data?.message || "Login Failed");

        } finally {
            setLoading(false);
        }
    }


    return (
        <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4">
            {/* Top Right Link */}
            <div className="absolute top-4 right-4 text-sm">
                <span>{t("Don't have an account?")}</span>
                <NavLink to="/signup" className="text-black font-medium underline">{t("Register")}</NavLink>
            </div>

            {/* Login Card */}
            <div className="bg-white shadow-md rounded-lg max-w-md w-full p-8">
                {/* Avatar */}
                <div className="flex justify-center mb-6">
                    <div className="w-14 h-14 rounded-full bg-gray-200 flex items-center justify-center">
                        <FaUser className="text-xl text-gray-600" />
                    </div>
                </div>

                {/* Title */}
                <h2 className="text-xl font-semibold text-center mb-1">{t("Login to your account")}</h2>
                <p className="text-sm text-center text-gray-500 mb-6">{t("Enter your details to login.")}</p>

                {/* Form Start */}
                <form onSubmit={handleSubmit}>
                    {/* Email */}
                    <div className="mb-4">
                        <label className="text-sm font-medium mb-1 block">{t("Email")}</label>
                        <div className="flex items-center border rounded px-3 py-2">
                            <FaEnvelope className="text-gray-400 mr-2" />
                            <input
                                type="email"
                                name="email"
                                value={formData.email}
                                placeholder="Ex:z@financial.com"
                                className="w-full outline-none text-sm"
                                onChange={handleChange}
                                required
                                autoComplete="email"
                            />
                        </div>
                    </div>

                    {/* Password */}
                    <div className="mb-4">
                        <label className="text-sm font-medium mb-1 block">{t("Password")}</label>
                        <div className="flex items-center border rounded px-3 py-2">
                            <FaLock className="text-gray-400 mr-2" />
                            <input
                                type={showPassword ? 'text' : 'password'}
                                name="password"
                                value={formData.password}
                                placeholder="Enter your password"
                                className="w-full outline-none text-sm"
                                onChange={handleChange}
                                required
                                autoComplete="current-password"
                            />
                            <button
                                type="button"
                                className="ml-2 text-gray-400"
                                onClick={() => setShowPassword(!showPassword)}
                            >
                                {showPassword ? <FaEye /> : <FaEyeSlash />}
                            </button>
                        </div>
                    </div>

                    {/* Remember Me + Forgot */}
                    <div className="flex items-center justify-between text-sm mb-6">
                        <label className="flex items-center">
                            <input type="checkbox" className="mr-2" checked={rememberMe} onChange={(e) => {
                                setRememberMe(e.target.checked);
                                setFormData((prev) => ({ ...prev, rememberMe: e.target.checked }));
                            }}
                            />
                            {t("Remember me")}
                        </label>
                        <Link to="/forgotpassword" className="text-black font-medium underline">
                            {t("Forgot Password?")}
                        </Link>
                    </div>

                    {/* Sign In Button */}
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-gray-700 text-white py-2 rounded hover:bg-gray-800 transition  disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {loading ? 'Signing in...' : t('Sign In')}
                    </button>
                </form>
            </div>

            {/* Footer */}
            <div className="absolute bottom-4 left-4 text-xs text-gray-400">
                ©2024 Financial Dashboard
            </div>

            {/* Language Select */}
            <div className="absolute bottom-4 right-4">
                <select value={lang} onChange={(e) => dispatch(setLanguage(e.target.value))} className="border border-gray-200 shadow-sm text-sm px-3 py-2  rounded-lg flex items-center gap-1 bg-white text-gray-700 hover:bg-gray-50">
                    <option value="en">🌐 ENG</option>
                    <option value="sp">🌐 SP</option>
                </select>
            </div>
        </div>
    );

};

export default Login;
