// ResetPassword.jsx
import axios from 'axios';
import React, { useState } from 'react';
import toast from 'react-hot-toast';
import { FaLock, FaHeadset } from 'react-icons/fa';
import { useSelector } from 'react-redux';
import { useLocation, useNavigate } from 'react-router-dom';
// jwt.verify(token,process.env.JWT_SECRET3)
const ResetPassword = () => {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const navigate = useNavigate();
  //const userEmail = useSelector((state) => state.registration.register.email)

  const location = useLocation();   // gives full path like /email-verified?token=abc123&userId=456   
  const queryParams = new URLSearchParams(location.search);
  const token = queryParams.get("token");
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      toast.error("Passwords do not match.");
      return;
    }
    try {
      const response = await axios.post(`${import.meta.env.VITE_API_URL}/api/resetpassword`, { confirmPassword }, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
      if (response.status === 200) {
        toast.success("Password has changed!");
        navigate("/login");
      }
    }
    catch (error) {
      toast.error("Error occurred!");
      console.log("Error:", error)

    }
    console.log('Password reset submitted:', password);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4 relative">
      {/* Card */}
      <div className="bg-white p-8 rounded-lg shadow-md max-w-md w-full text-center">
        {/* Icon */}
        <div className="w-14 h-14 rounded-full bg-gray-100 mx-auto mb-4 flex items-center justify-center">
          <FaLock className="text-xl text-gray-600" />
        </div>

        {/* Title */}
        <h2 className="text-lg font-semibold mb-2">Reset Your Password</h2>
        <p className="text-sm text-gray-600 mb-6">
          Enter your new password below.
        </p>

        {/* Form */}
        <form onSubmit={handleSubmit}>
          {/* New Password */}
          <div className="relative mb-4">
            <FaLock className="absolute left-3 top-3 text-gray-400" />
            <input
              type="password"
              placeholder="New Password"
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-black"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          {/* Confirm Password */}
          <div className="relative mb-6">
            <FaLock className="absolute left-3 top-3 text-gray-400" />
            <input
              type="password"
              placeholder="Confirm Password"
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-black"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full bg-black text-white py-2 rounded hover:bg-gray-900 transition"
          >
            Reset Password
          </button>
        </form>
      </div>

      {/* Footer Left */}
      <div className="absolute bottom-4 left-4 text-xs text-gray-400">
        ©2024 LOGO Financial
      </div>

      {/* Footer Right */}
      <div className="absolute bottom-4 right-4">
        <button className="border border-gray-200 shadow-sm text-sm px-3 py-2 rounded-lg flex items-center gap-1 bg-white text-gray-700 hover:bg-gray-50">
          <FaHeadset className="text-base" />
          Get Help
        </button>
      </div>

      {/* Top Right */}
      <div className="absolute top-4 right-4 text-sm">
        <span className="text-gray-600">Have an account? </span>
        <Link to="/login" className="text-black font-medium underline">Login</Link>
      </div>
    </div>
  );
};

export default ResetPassword;
