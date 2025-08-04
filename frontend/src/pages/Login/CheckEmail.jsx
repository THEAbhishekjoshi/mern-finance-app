import React, { useEffect } from 'react';
import { FaEnvelope, FaHeadset, FaGlobe } from 'react-icons/fa';
import { useDispatch, useSelector } from 'react-redux';
import { setLanguage } from '../../features/languageSelector/languageSlice';
import { useTranslation } from 'react-i18next';
import toast from 'react-hot-toast';
import axios from 'axios';

const CheckEmail = () => {
    //const dispatch = useDispatch();
    const email = useSelector((state) => state.registration.register.email);
    const { t, i18n } = useTranslation();
    const dispatch = useDispatch();
    console.log("Email from Redux:", email);
    const lang = useSelector((state) => state.i18n.lang);

    const handleSendAgain = async () => {
        const token = localStorage.getItem('token');
        try {
            const resp = await axios.post(`${import.meta.env.VITE_API_URL}/api/send-email-again`,
                { email }, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            if (resp.status === 200) {
                toast.success("Verification email sent again!");
            }
        } catch (error) {
            toast.error("Error Occurred While Sending Email");
            console.log("error while sending messsage:", error)
        }
    }

    return (
        <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4 relative">
            {/* Card */}
            <div className="bg-white shadow-md rounded-lg max-w-md w-full p-8 text-center">
                {/* Icon */}
                <div className="flex justify-center mb-6">
                    <div className="w-14 h-14 rounded-full bg-gray-200 flex items-center justify-center">
                        <FaEnvelope className="text-xl text-gray-600" />
                    </div>
                </div>

                {/* Heading */}
                <h2 className="text-xl font-semibold mb-2">{t("To login, check your email")}</h2>
                <p className="text-sm text-gray-600 mb-4">
                    {t("For security, we've sent you an email to")}<br />
                    <span className="font-medium text-blue-800 underline" >{email}</span>{t(". Simply click the link in the email and you'll be set.")}
                </p>

                {/* Resend */}
                <div className="text-sm text-gray-700">
                    {t("Didn’t get an email?")}{' '}
                    <br />
                    <div onClick={handleSendAgain} href="#" className="font-medium mt-3.5 text-black underline  hover:text-blue-600 inline-block">
                        {t("Send it again")}
                    </div>
                </div>
            </div>

            {/* Footer left */}
            <div className="absolute bottom-4 left-4 text-xs text-gray-400">
                Dashboard
            </div>

            {/* Language dropdown */}
            {/* <div className="absolute bottom-4 right-4">
                <button className="border border-gray-200 shadow-sm text-sm px-3 py-2 rounded-lg flex items-center gap-1 bg-white text-gray-700 hover:bg-gray-50">
                    <FaGlobe className="text-base" />
                    ENG
                </button>
            </div> */}

            {/* Language dropdown  */}

            <div className="absolute bottom-4 right-4">
                <select value={lang} onChange={(e) => dispatch(setLanguage(e.target.value))} className="border border-gray-200 shadow-sm text-sm px-3 py-2  rounded-lg flex items-center gap-1 bg-white text-gray-700 hover:bg-gray-50">
                    <option value="en">🌐 ENG</option>
                    <option value="sp">🌐 SP</option>
                </select>
            </div>

        </div>
    );
};

export default CheckEmail;
