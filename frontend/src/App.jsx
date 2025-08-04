import { useState } from 'react'
import Register from './pages/Register/Register'
import Login from './pages/Login/Login'
import Account from './pages/Login/Account'
import Country from './pages/Login/Country'
import MobileNumber from './pages/Login/MobileNumber'
import OtpVerify from './pages/Login/Otpverify'
import { Route, createBrowserRouter, createRoutesFromElements, RouterProvider, Navigate } from 'react-router-dom'
import MainLayout from './Layout/MainLayout'
import LoginLayout from './Layout/LoginLayout'
import CheckEmail from './pages/Login/CheckEmail'
import EmailVerified from './pages/Login/EmailVerified'
import Dashboard from './pages/Dashboard/Dashboard'
import BalancePage from './pages/Dashboard/Balance'
import DashboardLayout from './Layout/DashboardLayout'
import NotFound from './components/NotFound'
import ResetMessage from './pages/Login/ResetMessage'
import ForgotPassword from './pages/Login/ForgotPassword'
import ResetPassword from './pages/Login/ResetPassword'


function App() {
  const router = createBrowserRouter(
    createRoutesFromElements(
      <Route path="/" element={<MainLayout />} >
        <Route index element={<Login />} />
        <Route path="signup" element={<Register />} />

        {/* Login entry route (public) */}
        <Route path="login" element={<Login />} />
        <Route path="forgotpassword" element={<ForgotPassword />} />
        <Route path="sendmessage" element={<ResetMessage />} />
        <Route path="resetpassword" element={<ResetPassword />} />

        {/* Protected routes under LoginLayout */}
        <Route path="login-steps/*" element={<LoginLayout />}>
          {/* Nested Routes for Login Steps */}
          <Route path="account" element={<Account />} />
          <Route path="country" element={<Country />} />
          <Route path="mobile-number" element={<MobileNumber />} />
          <Route path="otp-verify" element={<OtpVerify />} />
          <Route path="check-email" element={<CheckEmail />} />
          <Route path="email-verified" element={<EmailVerified />} />
          {/* <Route path="*" element={<Navigate to="/login" replace />} /> */}
        </Route>

        {/*Protected Routes */}
        <Route path='dashboard' element={<DashboardLayout />}>
          <Route index element={<Dashboard />} />
          <Route path='balance' element={<BalancePage />} />
        </Route>

        <Route path="*" element={<NotFound />} />
      </Route>
    )
  )

  return (
    <>
      <RouterProvider router={router} />
    </>
  )
}

export default App
