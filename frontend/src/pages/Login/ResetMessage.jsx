import React from 'react';
import { FaHeadset } from 'react-icons/fa';
import { Link } from 'react-router-dom';

const ResetMessage = () => {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4 relative">
      {/* Success Card */}
      <div className="bg-white p-8 rounded-lg shadow-md max-w-md w-full text-center">
        <div className="w-16 h-16 rounded-full bg-gray-100 mx-auto mb-4 flex items-center justify-center">
          <img src="https://img.icons8.com/?size=100&id=0GU4b5gZ4PdA&format=png&color=000000"
            alt="checkmark"
            className="h-8 w-8" />
        </div>

        <h2 className="text-lg font-semibold mb-2">Successfully send a link</h2>
        <p className="text-sm text-gray-600">
          Open link at your email and reset your password and make a new password again.
        </p>
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

export default ResetMessage;
