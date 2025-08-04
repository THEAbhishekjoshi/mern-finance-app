import React, { useState, useEffect } from 'react';
import { FaFlag, FaCheckCircle, FaLock, FaUser } from 'react-icons/fa';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import CountryName from '../../components/CountryName';
import { useDispatch, useSelector } from 'react-redux';
import { setCountry } from '../../features/onboarding/registrationSlice';
import toast from 'react-hot-toast';
import { setLanguage } from '../../features/languageSelector/languageSlice';
import { useTranslation } from 'react-i18next';

const Country = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const selectedCountry = useSelector((state) => state.registration.setCountry);
    const { t, i18n } = useTranslation();
    const lang = useSelector((state)=> state.i18n.lang);

    const countries = CountryName();    //API call to get the list of countries
    countries.sort((a, b) => a.name.common.localeCompare(b.name.common))

    const handleClick = async (e) => {
        if (selectedCountry == '') {
            toast.error("Choose the Country")
            return;
        }
        try {
            const token = localStorage.getItem('token');
            const response = await axios.post(`${import.meta.env.VITE_API_URL}/api/country`, {
                country: selectedCountry
            }, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            // Navigate to next step
            navigate('/login-steps/mobile-number');
        } catch (error) {
            console.error('Failed to send account type:', error);
            toast.error(error?.response?.data?.error || "Failed to save Account type")
        }
    }

    return (
        <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4 relative">
            {/* Stepper Banner */}
            <div className="absolute top-6 flex items-center gap-3 text-sm font-medium">
                {/* Step 1 */}
                <div className="flex items-center gap-1 text-green-600 border rounded-4xl p-2">
                    <FaCheckCircle />
                    <span>1. {t("Email")}</span>
                </div>
                <span className="text-gray-400">›</span>

                {/* Step 2 */}
                <div className="flex items-center gap-1 text-green-600 border rounded-4xl p-2">
                    <FaCheckCircle />
                    <span>2. {t("Account Type")}</span>
                </div>
                <span className="text-gray-400">›</span>

                {/* Step 3 - Current */}
                <div className="flex items-center gap-1 text-black border rounded-4xl p-2">
                    <FaFlag className="text-gray-600" />
                    <span>3. {t("Country")}</span>
                </div>
                <span className="text-gray-400">›</span>

                {/* Step 4 */}
                <div className="flex items-center gap-1 text-gray-400 border rounded-4xl p-2">
                    <FaLock />
                    <span>4. 2FA</span>
                </div>
            </div>

            {/* Card */}
            <div className="bg-white shadow-md rounded-lg max-w-md w-full p-8 mt-24">
                {/* Icon */}
                <div className="flex justify-center mb-6">
                    <div className="w-14 h-14 rounded-full bg-gray-200 flex items-center justify-center">
                        <FaFlag className="text-xl text-gray-600" />
                    </div>
                </div>

                {/* Title */}
                <h2 className="text-xl font-semibold text-center mb-2">
                    {t("Your country of primary residence")}
                </h2>
                <p className="text-sm text-center text-gray-500 mb-6">
                    {t("You can add another account later on, too.")}
                </p>

                {/* Country Select */}
                <div className="mb-6">
                    <label className="text-sm font-medium mb-2 block">{t("Choose Country")}</label>
                    <select
                        className="w-full border rounded px-3 py-2 bg-white text-sm pr-7"
                        value={selectedCountry}
                        onChange={(e) => dispatch(setCountry(e.target.value))}
                    >
                        <option value="">{t("Select a country")}</option>
                        {/* Sample static option — replace with API call later */}
                        {/* <option value="us">🇺🇸 United States</option>
                        <option value="in">🇮🇳 India</option>
                        <option value="uk">🇬🇧 United Kingdom</option> */}
                        {countries.map((country, index) => (
                            <option key={index} value={country.name.common}>
                                {country.name.common}
                            </option>
                        ))}
                    </select>
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

            {/* Language Switch */}
            <div className="absolute bottom-4 right-4">
                <select value={lang} onChange={(e) => dispatch(setLanguage(e.target.value))} className="border border-gray-200 shadow-sm text-sm px-3 py-2  rounded-lg flex items-center gap-1 bg-white text-gray-700 hover:bg-gray-50">
                    <option value="en">🌐 ENG</option>
                    <option value="sp">🌐 SP</option>
                </select>
            </div>
        </div>
    );
};

export default Country;
