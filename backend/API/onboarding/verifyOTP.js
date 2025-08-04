import express from 'express';
const router = express.Router();
router.use(express.json());
import twilio from 'twilio';
import jwt from 'jsonwebtoken';
import { newUsers } from '../../models/user.js';
const jwt_secret_code = "financeLoginJwtWebToken"

const client = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);
console.log("Loaded ENV inside MobileNumber.js", {
    SID: process.env.TWILIO_VERIFY_SID,
    ACCOUNT: process.env.TWILIO_ACCOUNT_SID,
    TOKEN: process.env.TWILIO_AUTH_TOKEN
});


router.post("/otp-verify", async (req, res) => {
    const token = req.headers?.authorization?.split(" ")[1]; //get token 
    if (!token) return res.status(401).json({ error: "No token provided" });

    try {
        const { code } = req.body;
        console.log(code);
        const decoded = jwt.verify(token, jwt_secret_code);
        const userId = decoded.userId;

        const user = await newUsers.findOne({ _id: userId });   //.select("mobileNumber")
        const phone = user?.mobileNumber;
        console.log("phone:", phone)
        const verificationCheck = await client.verify.v2.services(process.env.TWILIO_VERIFY_SID)
            .verificationChecks.create({ to: `${phone}`, code });

        if (verificationCheck.status === 'approved') {
            res.json({ success: true, message: 'OTP verified successfully', user });
        } else {
            res.status(400).json({ success: false, message: 'Invalid OTP' });
        }
    } catch (error) {

        res.status(400).json({
            success: false,
            error:
                error?.message ||                      // standard error message
                error?.response?.data?.message ||      // Twilio often uses this
                JSON.stringify(error, Object.getOwnPropertyNames(error)) ||  // full object
                "Unknown error"
        });
    }

})
export default router;