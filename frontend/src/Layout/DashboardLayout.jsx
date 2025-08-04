import React from 'react';
import { jwtDecode } from 'jwt-decode';
import { Navigate, Outlet } from 'react-router-dom';

const DashboardLayout = () => {
  const token = localStorage.getItem('token');
  let isValid = false;

  if (token) {
    try {
      const { exp } = jwtDecode(token);
      if (Date.now() < exp * 1000) {     //  compare with current time
        isValid = true;
      } else {
        localStorage.removeItem('token'); // token expired = remove 
      }
    } catch (error) {
      localStorage.removeItem('token'); // invalid token = remove
    }
  }

  return isValid ? <Outlet /> : <Navigate to="/login" replace />;
}

export default DashboardLayout