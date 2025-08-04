import React, { useEffect } from 'react';
import { FaEnvelope, FaHeadset, FaGlobe, FaEnvelopeOpen } from 'react-icons/fa';
import { useDispatch, useSelector } from 'react-redux';
import { setLanguage } from '../../features/languageSelector/languageSlice';
import { useTranslation } from 'react-i18next';
import {  useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';

const EmailVerified = () => {
    const verifiedEmail = useSelector((state) => state.registration.email);
    const { t, i18n } = useTranslation();
    const dispatch = useDispatch();
    const navigate = useNavigate()
    const lang = useSelector((state)=> state.i18n.lang);

       // 🔍 Extract token from URL
    const location = useLocation();   // gives full path like /email-verified?token=abc123&userId=456   
    const queryParams = new URLSearchParams(location.search);
    const token = queryParams.get("token");
    const handleClick=async()=>{
        const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/verify-email?token=${token}`)
        console.log(res);
        if(res.status==200){
            navigate('/dashboard')
        }
    }

    return (
        <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4 relative">
            {/* Card */}
            <div className="bg-white shadow-md rounded-lg max-w-md w-full p-8 text-center">
                {/* Icon */}
                <div className="flex justify-center mb-6">
                    <div className="w-14 h-14 rounded-full bg-gray-200 flex items-center justify-center">
                        <FaEnvelopeOpen className="text-xl text-gray-600" />
                    </div>
                </div>

                {/* Title */}
                <h2 className="text-xl font-semibold mb-2">{t("Email Verified")}</h2>

                {/* Message */}
                <p className="text-sm text-gray-600 mb-6">
                    {t("Your email address")} <span className="font-medium text-gray-800">{verifiedEmail}</span>{t(" has been verified.")} <br />
                    {t("In the future, you need to use this email address when logging in to ketro.")}
                </p>

                {/* Continue Button */}
                <button className="w-full bg-black text-white py-2 rounded hover:bg-gray-900 transition" onClick={handleClick}>
                    {t("Continue")}
                </button>
            </div>

            {/* Footer Left */}
            <div className="absolute bottom-4 left-4 text-xs text-gray-400">
                ©2024 LOGO Financial
            </div>

            {/* Footer Right */}
            <div className="absolute top-4 right-4">
                <button className="border border-gray-200 shadow-sm text-sm px-3 py-2 rounded-lg flex items-center gap-1 bg-white text-gray-700 hover:bg-gray-50">
                    <FaHeadset className="text-base" />
                    Get Help{t("")}
                </button>
            </div>
            {/* language Selector */}
            <div className="absolute bottom-4 right-4">
                <select value={lang} onChange={(e) => dispatch(setLanguage(e.target.value))} className="border border-gray-200 shadow-sm text-sm px-3 py-2  rounded-lg flex items-center gap-1 bg-white text-gray-700 hover:bg-gray-50">
                    <option value="en">🌐 ENG</option>
                    <option value="sp">🌐 SP</option>
                </select>
            </div>
        </div>
    );
};

export default EmailVerified;
