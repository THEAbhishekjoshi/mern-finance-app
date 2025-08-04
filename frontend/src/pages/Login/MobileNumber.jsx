import React, { useState, useEffect, use } from 'react';
import { FaPhone, FaCheckCircle, FaLock, FaUser, FaFlag, FaGlobe } from 'react-icons/fa';
import useMobileNumber from '../../components/useMobileNumber';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { setMobileNumber } from '../../features/onboarding/registrationSlice';
import toast from 'react-hot-toast';
import { useTranslation } from 'react-i18next';
import { setLanguage } from '../../features/languageSelector/languageSlice';

const MobileNumber = () => {
    const [phone, setPhone] = useState('');
    const [selectedCode, setSelectedCode] = useState('');
    const callerCodeAPI = useMobileNumber();
    const dispatch = useDispatch();
    const callNumber = useSelector((state) => state.registration.MobileNumber);
    const { t, i18n } = useTranslation();
    const navigate = useNavigate();
    const lang = useSelector((state)=> state.i18n.lang);


    const handleClick = async (e) => {
        if (!selectedCode || !phone) {
            toast.error("Please select a country code and enter your phone number")
            return;
        }
        const fullNumber = selectedCode + phone;
        localStorage.setItem('mobileNumber', fullNumber);
        try {
            const token = localStorage.getItem('token');
            dispatch(setMobileNumber(fullNumber));
            //console.log(fullphone)
            const response = await axios.post(`${import.meta.env.VITE_API_URL}/api/mobile-number`, {
                mobileNumber: fullNumber
            }, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            // Navigate to next step
            navigate('/login-steps/otp-verify');
        } catch (error) {
            console.error('Failed to add Mobile Number:', error);
            toast.error(error?.response?.data?.error || "Failed to add Mobile Number")
        }
    }
    return (
        <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4 relative">
            {/* Stepper Banner */}
            <div className="absolute top-6 flex items-center gap-3 text-sm font-medium ">
                <div className="flex items-center gap-1 text-green-600 border rounded-4xl p-2" >
                    <FaCheckCircle />
                    <span>1. {t("Email")}</span>
                </div>
                <span className="text-gray-400">›</span>
                <div className="flex items-center gap-1 text-green-600 border rounded-4xl p-2">
                    <FaCheckCircle />
                    <span>2. {t("Account Type")}</span>
                </div>
                <span className="text-gray-400">›</span>
                <div className="flex items-center gap-1 text-green-600 border rounded-4xl p-2">
                    <FaCheckCircle />
                    <span>3. {t("Country")}</span>
                </div>
                <span className="text-gray-400">›</span>
                <div className="flex items-center gap-1 text-black border rounded-4xl p-2">
                    <FaLock />
                    <span>4. 2FA</span>
                </div>
            </div>

            {/* Main Card */}
            <div className="bg-white shadow-md rounded-lg max-w-md w-full p-8 mt-24">
                {/* Icon */}
                <div className="flex justify-center mb-6">
                    <div className="w-14 h-14 rounded-full bg-gray-200 flex items-center justify-center">
                        <FaPhone className="text-xl text-gray-600" />
                    </div>
                </div>

                {/* Title */}
                <h2 className="text-xl font-semibold text-center mb-2">
                    {t("Verify your phone number with a code")}
                </h2>
                <p className="text-sm text-center text-gray-500 mb-6">
                    {t("It helps your account to keep secure.")}
                </p>

                {/* Phone Input */}
                <div className="mb-6">
                    <label className="text-sm font-medium mb-2 block">{t("Phone Number")}</label>
                    <div className="flex items-center border rounded px-4 py-2 bg-white gap-2">
                        {/* Country Code Dropdown */}
                        <select
                            value={selectedCode}
                            onChange={(e) => setSelectedCode(e.target.value)}
                            className="bg-white text-sm pr-1 outline-none"
                        >
                            {callerCodeAPI.map((Number, index) => (
                                <option key={index} value={Number.idd.root + Number.idd.suffixes?.[0]}>
                                    {Number.idd.root + Number.idd.suffixes?.[0]}
                                </option>
                            ))}
                        </select>

                        {/* Phone Input */}
                        <input
                            type="tel"
                            placeholder="623913909393"
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                            className="w-full outline-none text-sm"
                        />
                    </div>
                </div>

                {/* Button */}
                <button onClick={handleClick}
                    className="w-full bg-black text-white py-2 rounded hover:bg-gray-900 transition"
                >
                    {t("Continue")}
                </button>
            </div>

            {/* Footer */}
            <div className="absolute bottom-4 left-4 text-xs text-gray-400">
                ©2024 LOGO Financial
            </div>

            {/* Language Switcher */}
            <div className="absolute bottom-4 right-4">
                <select value={lang} onChange={(e) => dispatch(setLanguage(e.target.value))} className="border border-gray-200 shadow-sm text-sm px-3 py-2  rounded-lg flex items-center gap-1 bg-white text-gray-700 hover:bg-gray-50">
                    <option value="en">🌐 ENG</option>
                    <option value="sp">🌐 SP</option>
                </select>
            </div>
        </div>
    );
};

export default MobileNumber;
