import React, { useState } from 'react';
import { FaLock, FaUser, FaBriefcase, FaCheckCircle, FaGlobe } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import { setAccountType } from '../../features/onboarding/registrationSlice';
import { useTranslation } from 'react-i18next';

const Account = () => {
    //const [selectedType, setSelectedType] = useState('personal');
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const selectedType = useSelector((state) => state.registration.accountType);
    const { t, i18n } = useTranslation();
    const lang = useSelector((state)=> state.i18n.lang);


    const handleClick = async (e) => {

        try {
            const token = localStorage.getItem('token');
            const response = await axios.post(`${import.meta.env.VITE_API_URL}/api/account-type`, {
                accountType: selectedType
            }, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            // Navigate to next step
            navigate('/login-steps/country');
        } catch (error) {
            console.error('Failed to send account type:', error);
            toast.error(error?.response?.data?.error || "Failed to save Account type")
        }
    }

    return (
        <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4 relative">
            {/* Stepper Top */}
            <div className="absolute top-6 flex items-center gap-3 text-sm font-medium">
                {/* Step 1 */}
                <div className="flex items-center gap-1 text-green-600 border rounded-4xl p-2">
                    <FaCheckCircle />
                    <span>1. {t("Email")}</span>
                </div>
                <span className="text-gray-400">›</span>

                {/* Step 2 - Current */}
                <div className="flex items-center gap-1 text-black border rounded-4xl p-2">
                    <FaLock className="text-gray-500" />
                    <span>2. {t("Account Type")}</span>
                </div>
                <span className="text-gray-400">›</span>

                {/* Next Steps */}
                <div className="flex items-center gap-1 text-gray-400 border rounded-4xl p-2">
                    <FaUser />
                    <span>3. {t("Country")}</span>
                </div>
                <span className="text-gray-400">›</span>
                <div className="flex items-center gap-1 text-gray-400  border rounded-4xl p-2">
                    <FaLock />
                    <span>4. 2FA</span>
                </div>
            </div>

            {/* Main Card */}
            <div className="bg-white shadow-md rounded-lg max-w-md w-full p-8 mt-24">
                {/* Avatar */}
                <div className="flex justify-center mb-6">
                    <div className="w-14 h-14 rounded-full bg-gray-200 flex items-center justify-center">
                        <FaLock className="text-xl text-gray-600" />
                    </div>
                </div>

                {/* Title */}
                <h2 className="text-xl font-semibold text-center mb-2">
                    {t("What kind of account would you open today?")}
                </h2>
                <p className="text-sm text-center text-gray-500 mb-6">
                    {t("You can add another account later on, too.")}
                </p>

                {/* Account Options */}
                <div className="space-y-4 mb-6">
                    {/* Personal */}
                    <label
                        htmlFor="personal"
                        className={`flex items-center justify-between border rounded-lg p-4 cursor-pointer transition ${selectedType === 'personal' ? 'border-gray-800 shadow-sm' : 'border-gray-300'
                            }`}
                    >
                        <div className="flex items-center">
                            <div className="w-10 h-10 bg-gray-100 flex items-center justify-center rounded-lg mr-4">
                                <FaUser className="text-gray-600" />
                            </div>
                            <div>
                                <h4 className="font-medium">{t("Personal")}</h4>
                                <p className="text-sm text-gray-500">
                                    {t("Send, spend, and receive around the world for less")}
                                </p>
                            </div>
                        </div>
                        <input
                            type="checkbox"
                            name="accountType"
                            id="personal"
                            checked={selectedType === 'personal'}
                            onChange={() => dispatch(setAccountType('personal'))}
                            className="w-5 h-5 accent-black"
                        />
                    </label>

                    {/* Business */}
                    <label
                        htmlFor="business"
                        className={`flex items-center justify-between border rounded-lg p-4 cursor-pointer transition ${selectedType === 'business' ? 'border-gray-800 shadow-sm' : 'border-gray-300'
                            }`}
                    >
                        <div className="flex items-center">
                            <div className="w-10 h-10 bg-gray-100 flex items-center justify-center rounded-lg mr-4">
                                <FaBriefcase className="text-gray-600" />
                            </div>
                            <div>
                                <h4 className="font-medium">{t("Business")}</h4>
                                <p className="text-sm text-gray-500">
                                    {t("Do business or freelance work internationally")}
                                </p>
                            </div>
                        </div>
                        <input
                            type="checkbox"
                            name="accountType"
                            id="business"
                            checked={selectedType === 'business'}
                            onChange={() => dispatch(setAccountType('business'))}
                            className="w-5 h-5 accent-black"
                        />
                    </label>
                </div>

                {/* Continue Button */}
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

            {/* Language Select (static for now) */}
            <div className="absolute bottom-4 right-4">
                <select value={lang} onChange={(e) => dispatch(setLanguage(e.target.value))} className="border border-gray-200 shadow-sm text-sm px-3 py-2  rounded-lg flex items-center gap-1 bg-white text-gray-700 hover:bg-gray-50">
                    <option value="en">🌐 ENG</option>
                    <option value="sp">🌐 SP</option>
                </select>
            </div>
        </div>
    );
};

export default Account;
