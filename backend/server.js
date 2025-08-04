import './config/env.js';

import express from 'express';
import cors from 'cors';

const app = express();
app.use(cors()) //allows all origins
// const allowedOrigins = [
//   process.env.CLIENT_URL,           // Vercel frontend
//   'http://localhost:5173'           // Local development
// ];
// app.use(cors({
//     origin: function (origin, callback) {
//         if (allowedOrigins.includes(origin)) {
//             callback(null, true);
//         } else {
//             callback(new Error('Not allowed by CORS'));
//         }
//     },
//     credentials: true
// }));

// app.use(cors({
//   origin: function (origin, callback) {
//     console.log("Incoming origin:", origin);
//     callback(null, true);  // Allow all origins
//   },
//   credentials: true
// }));

app.use(express.json());

import registerRouter from './API/register/register.js';
import loginRouter from './API/onboarding/login.js';
import accountTypeRouter from './API/onboarding/account-type.js'
import countryRouter from './API/onboarding/country.js'
import mobileNumberRouter from './API/onboarding/MobileNumber.js'
import verifyOtpRouter from './API/onboarding/verifyOTP.js'
import sendOtpRouter from './API/onboarding/sendOTP.js'
import sendEmailRouter from './API/onboarding/sendEmail.js';
import verifyEmailRouter from './API/onboarding/verifyEmail.js'
import plaidRouter from './API/plaid/generateToken.js'
import geminiRouter from './API/gemini/geminiai.js';
import forgotRouter from './API/forgotPassword/forgotpassword.js'
import setPasswordRouter from './API/forgotPassword/resetPassword.js'

app.use("/api", registerRouter);
app.use("/api", loginRouter);
app.use("/api", accountTypeRouter);
app.use("/api", countryRouter);
app.use("/api", mobileNumberRouter);
app.use("/api", verifyOtpRouter);
app.use("/api", sendOtpRouter)
app.use("/api", sendEmailRouter)
app.use("/api", verifyEmailRouter)
app.use("/api", plaidRouter)
app.use("/api", geminiRouter)
app.use("/api", forgotRouter)
app.use("/api", setPasswordRouter)

const PORT = process.env.PORT || 5004;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})
