import React from 'react';
import { Link } from 'react-router-dom';

const NotFound = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 px-4 text-center">
      <img
        src="https://illustrations.popsy.co/amber/falling.svg"
        alt="404 Not Found"
        className="w-80 mb-8"
      />
      <h1 className="text-4xl font-bold mb-2 text-gray-800">404 - Page Not Found</h1>
      <p className="text-gray-600 mb-6">
        Oops! The page you are looking for doesn’t exist or was moved.
      </p>
      <Link
        to="/"
        className="bg-blue-600 text-white px-6 py-2 rounded-lg shadow hover:bg-blue-700 transition"
      >
        Go to Home
      </Link>
    </div>
  );
};

export default NotFound;
