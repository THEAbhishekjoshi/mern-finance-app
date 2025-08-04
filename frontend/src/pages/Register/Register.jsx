import React, { useState } from 'react';
import { FaUser, FaEnvelope, FaLock, FaEye, FaEyeSlash, FaGlobe } from 'react-icons/fa';
import { NavLink } from 'react-router-dom';
import axios from 'axios'
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { setLanguage } from '../../features/languageSelector/languageSlice';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';


///Without the brackets, JS would treat it as a literal key "e.target.name" (a string), not the value of the variable.
    //...formData copies all current values (like name, email, password)
    //Then [e.target.name]: e.target.value overwrites only the one field that changed.
    //JS objects don't allow duplicate keys — so it replaces the old value of the key if it already exists.

const Register = () => {
    const [showPassword, setShowPassword] = useState(false);
    const [formData,setFormData] =useState({
        fullname:'',
        email:'',
        password:''
    })
    const navigate = useNavigate();
    const { t, i18n } = useTranslation();
    const lang = useSelector((state)=> state.i18n.lang);

    const handleChange = (e) => {
        setFormData({...formData,[e.target.name]: e.target.value})
    }
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await axios.post(`${import.meta.env.VITE_API_URL}/api/signup`, formData);
            toast.success(res.data.message)
            if (res.status === 200) {
                // Redirect to login page after successful signup
                navigate('/login');
            }
        }
        catch (error) {
            console.error("Signup error:", error);
            toast.error(error?.response?.data?.message || "Signup Failed")
        }
    }

    return (
        <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4">
            {/* Top Login */}
            <div className="absolute top-4 right-4 text-sm">
                <span>{t("Already, have an account?")}</span>
                <NavLink to="/login" className="text-black font-medium underline">{t("Login")}</NavLink>
            </div>

            {/* Card */}
            <div className="bg-white shadow-md rounded-lg max-w-md w-full p-8">
                {/* Avatar */}
                <div className="flex justify-center mb-6">
                    <div className="w-14 h-14 rounded-full bg-gray-200 flex items-center justify-center">
                        <FaUser className="text-xl text-gray-600" />
                    </div>
                </div>

                {/* Title */}
                <h2 className="text-xl font-semibold text-center mb-1">{t("Create a new account")}</h2>
                <p className="text-sm text-center text-gray-500 mb-6">{t("Enter your details to register.")}</p>

                {/* Fullname */}
                <div className="mb-4">
                    <label className="text-sm font-medium mb-1 block">{t("Fullname")}</label>
                    <div className="flex items-center border rounded px-3 py-2">
                        <FaUser className="text-gray-400 mr-2" />
                        <input
                            name="fullname"
                            type="text"
                            placeholder="Ex: John doe"
                            className="w-full outline-none text-sm"
                            onChange={handleChange}
                        />
                    </div>
                </div>

                {/* Email */}
                <div className="mb-4">
                    <label className="text-sm font-medium mb-1 block">{t("Email")}</label>
                    <div className="flex items-center border rounded px-3 py-2">
                        <FaEnvelope className="text-gray-400 mr-2" />
                        <input
                            name="email"
                            type="email"
                            placeholder="Ex: Johndoe@financial.com"
                            className="w-full outline-none text-sm"
                            onChange={handleChange}
                        />
                    </div>
                </div>

                {/* Password */}
                <div className="mb-2">
                    <label className="text-sm font-medium mb-1 block">{t("Password")}</label>
                    <div className="flex items-center border rounded px-3 py-2">
                        <FaLock className="text-gray-400 mr-2" />
                        <input
                            name='password'
                            type={showPassword ? "text" : "password"}
                            placeholder="Enter your password"
                            className="w-full outline-none text-sm"
                            onChange={handleChange}
                        />
                        <button
                            type="button"
                            className="ml-2 text-gray-400"
                            onClick={() => setShowPassword(!showPassword)}
                        >
                            {showPassword ? <FaEye /> : <FaEyeSlash />}
                        </button>
                    </div>
                    <p className="text-xs text-gray-400 mt-1 ml-1">
                        {t("Must contain 1 uppercase letter, 1 number, min. 8 characters.")}
                    </p>
                </div>

                {/* Button */}
                <form onSubmit={handleSubmit}>
                    <button className="w-full bg-gray-700 text-white py-2 rounded mt-6 hover:bg-gray-800 transition">
                        {t("Sign Up")}
                    </button>
                </form>

                {/* Terms */}
                <p className="text-xs text-center text-gray-500 mt-4">
                    {t("By clicking Register, you agree to accept LOGO Financial’s")} <br />
                    <a href="#" className="text-black font-medium underline">{t("Terms and Condition")}</a>
                </p>
            </div>

            {/* Footer */}
            <div className="absolute bottom-4 left-4 text-xs text-gray-400">
                ©2024 financial dashboard
            </div>

            {/* Language Select (static for now) */}
            <div className="absolute bottom-4 right-4">
                <select value={lang

                } onChange={(e) => dispatch(setLanguage(e.target.value))} className="border border-gray-200 shadow-sm text-sm px-3 py-2  rounded-lg flex items-center gap-1 bg-white text-gray-700 hover:bg-gray-50">
                    <option value="en">🌐 ENG</option>
                    <option value="sp">🌐 SP</option>
                </select>
            </div>
        </div>
    );
};

export default Register;
