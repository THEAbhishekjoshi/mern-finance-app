import express from 'express';
const router = express.Router();
import twilio from 'twilio';
import jwt from 'jsonwebtoken';
import { newUsers } from '../../models/user.js';


const client = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);
router.post("/mobile-number", async (req, res) => {
    const token = req.headers?.authorization?.split(" ")[1];
    if (!token) return res.status(401).json({ error: "No token provided" });

    try {
        const { mobileNumber } = req.body;
        const decoded = jwt.verify(token, process.env.jwt_secret_code);
        const userId = decoded.userId;

        // Save mobile number to DB
        await newUsers.updateOne({ _id: userId }, { $set: { mobileNumber } });

        // Send OTP via Twilio
        const verification = await client.verify.v2.services(process.env.TWILIO_VERIFY_SID)
            .verifications.create({
                to: mobileNumber,
                channel: 'sms'
            });

        res.status(200).json({
            success: true,
            message: "Mobile number saved and OTP sent",
            status: verification.status

        });

    } catch (error) {
        console.error("Error in saving/sending OTP:", error);
        res.status(500).json({ success: false, error: error.message });
    }
});

export default router;
