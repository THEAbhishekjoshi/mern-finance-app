import axios from 'axios';
import React, { useState } from 'react';
import toast from 'react-hot-toast';
import { FaLock, FaCheckCircle, FaFlag, FaPhone, FaGlobe } from 'react-icons/fa';
import { useNavigate, NavLink } from 'react-router-dom';
import { setLanguage } from '../../features/languageSelector/languageSlice';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';

const OtpVerify = () => {
  const [otp, setOtp] = useState('');
  const phone = localStorage.getItem('mobileNumber');
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { t, i18n } = useTranslation();
  const lang = useSelector((state)=> state.i18n.lang);

  // const handleChange = (e, index) => {
  //   const value = e.target.value;
  //   if (!/^\d*$/.test(value)) return; // Only allow numbers

  //   const updatedOtp = [...otp];
  //   updatedOtp[index] = value.slice(-1); // Only last digit if user pastes

  //   setOtp(updatedOtp);

  //   // Auto focus next
  //   if (value && index < 5) {
  //     document.getElementById(`otp-${index + 1}`).focus();
  //   }
  // }


  const handleChange = (e) => {
    const digitsOnly = e.target.value.replace(/\D/g, ''); // only numbers
    const formatted = digitsOnly.split('').join('-'); // limit to 6 digits and 5 dashes
    setOtp(formatted);
  };

  const handleClick = async (e) => {
    try {
      const token = localStorage.getItem('token');

      const response = await axios.post(`${import.meta.env.VITE_API_URL}/api/otp-verify`, {
        code: otp.replace(/-/g, '')
      }, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      if (response.data.success) {
        const token = localStorage.getItem('token');

        const response2 = await axios.post(`${import.meta.env.VITE_API_URL}/api/send-email`,
          { user: response.data.user }, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        if (response2.status === 200) {
          // Navigate to next step
          navigate('/login-steps/check-email');
        }
      };
    } catch (error) {
      //console.error('Incorrect OTP:', error);
      const errMsg = error?.response?.data?.error;
      toast.error(typeof errMsg === "string" ? errMsg : JSON.stringify(errMsg))
    }
  }
  const handleClickOtp = async (e) => {
    try {
      const token = localStorage.getItem('token');

      const response = await axios.post('http://localhost:5004/api/send-otp',
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
      alert("OTP sent successfully!");

    } catch (error) {
      //console.error('Oops! it did not work :', error);
      toast.error(error?.response?.data?.error || "Oops!!")

    }
  }

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4 relative">
      {/* Stepper Banner */}
      <div className="absolute top-6 flex items-center gap-3 text-sm font-medium">
        <div className="flex items-center gap-1 text-green-600 border rounded-4xl p-2">
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
          <FaCheckCircle />
          <span>4. 2FA</span>
        </div>
      </div>

      {/* Card */}
      <div className="bg-white shadow-md rounded-lg max-w-md w-full p-8 mt-24">
        {/* Icon */}
        <div className="flex justify-center mb-6">
          <div className="w-14 h-14 rounded-full bg-gray-200 flex items-center justify-center">
            <FaLock className="text-xl text-gray-600" />
          </div>
        </div>

        {/* Heading */}
        <h2 className="text-xl font-semibold text-center mb-2">{t("Enter 6 digit code")}</h2>
        <p className="text-sm text-center text-gray-500 mb-1">
          {t("We sent it to")} <span className="text-gray-900 font-medium">{phone}</span>.
          <NavLink to="/login-steps/mobile-number"><button className="text-sm text-blue-600 hover:underline ml-1">{t("Change")}</button></NavLink>
        </p>

        {/* Input */}
        <div className="my-6">
          <label className="text-sm font-medium mb-2 block">Your digit 6 code{t("Your digit 6 code")}</label>
          {/* {otp.map((digit, index) => (
            <input
              key={index}
              id={`otp-${index}`}
              type="text"
              inputMode="numeric"
              maxLength="1"
              className="w-10 h-10 text-center border rounded text-lg"
              value={digit}
              onChange={(e) => handleChange(e, index)}
            />
          ))} */}
          <input
            type="text"
            placeholder="1-2-3-4-5-6"
            value={otp}
            onChange={handleChange}
            maxLength={11}
            className="w-full border rounded px-4 py-2 text-lg tracking-widest text-center"
          />

        </div>

        {/* Submit */}
        <button onClick={handleClick}
          className="w-full bg-black text-white py-2 rounded hover:bg-gray-900 transition"
        >
          {t("Submit")}
        </button>

        {/* Resend */}
        <p className="text-center mt-4 text-sm text-gray-600">
          <button onClick={handleClickOtp} className="text-black font-medium hover:underline">{t("Didn't receive a code?")}</button>
        </p>
      </div>

      {/* Footer */}
      <div className="absolute bottom-4 left-4 text-xs text-gray-400">
        ©2024 LOGO Financial
      </div>

      {/* Language Selector */}
      <div className="absolute bottom-4 right-4">
        <select value={lang} onChange={(e) => dispatch(setLanguage(e.target.value))} className="border border-gray-200 shadow-sm text-sm px-3 py-2  rounded-lg flex items-center gap-1 bg-white text-gray-700 hover:bg-gray-50">
          <option value="en">🌐 ENG</option>
          <option value="sp">🌐 SP</option>
        </select>
      </div>
    </div>
  );
};

export default OtpVerify;
