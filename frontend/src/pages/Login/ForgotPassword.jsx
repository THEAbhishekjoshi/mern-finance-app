// ForgotPassword.jsx
import axios from 'axios';
import React, { useState } from 'react';
import toast from 'react-hot-toast';
import { FaEnvelope, FaHeadset } from 'react-icons/fa';
import { useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  //const userEmail=  useSelector((state)=> state.registration.register.email);
  const navigate = useNavigate();

  const handleSubmit = async(e) => {
    e.preventDefault();
    //if(!(email===userEmail)) return toast.error("Incorrect Email")
    try{
        const response = await axios.post(`${import.meta.env.VITE_API_URL}/api/forgotpassword`,{email:email})
        if(response.status===200){
          toast.success(response.data.message)
            navigate('/sendmessage')
        }else{
          toast.error(response.data.message)
        }
    }
    catch(error){
        console.log("Error",error)
        toast.error(error?.response?.data?.message || "Error Occurred!");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4 relative">
      {/* Form Card */}
      <div className="bg-white p-8 rounded-lg shadow-md max-w-md w-full text-center">
        <div className="w-14 h-14 rounded-full bg-gray-100 mx-auto mb-4 flex items-center justify-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 11c0-1.105.895-2 2-2s2 .895 2 2v1h-4v-1zM4 7v13h16V7H4zm16-2V4a2 2 0 00-2-2H6a2 2 0 00-2 2v1h16z" />
          </svg>
        </div>
        <h2 className="text-lg font-semibold mb-2">Forgot Your Password</h2>
        <p className="text-sm text-gray-600 mb-6">
          Enter your email and we will send you a link to reset your password.
        </p>
        <form onSubmit={handleSubmit}>
          <div className="relative mb-4">
            <FaEnvelope className="absolute left-3 top-3 text-gray-400" />
            <input
              type="email"
              placeholder="Email"
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-black"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <button
            type="submit"
            className="w-full bg-black text-white py-2 rounded hover:bg-gray-900 transition"
          >
            Send Email
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

export default ForgotPassword;
