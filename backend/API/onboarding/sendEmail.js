import express from 'express';
const router = express.Router();
router.use(express.json());
import jwt from 'jsonwebtoken';
import transporter from './email.js';
import { newUsers } from '../../models/user.js';
import sendVerificationEmail from '../utils/sendVerficationEmail.js';

router.post("/send-email", async (req, res) => {
    const token = req.headers?.authorization?.split(" ")[1]; //get token 
    if (!token) return res.status(401).json({ error: "No token provided" });
    try {
        const { user } = req.body
        await newUsers.updateOne({ _id: user._id },
            { $set: { isEmailVerified: false } }
        )
        await sendVerificationEmail(user);
        res.status(200).json({ message: 'Registration successful. Please check your email to verify.' });

    } catch (error) {
        res.status(500).json({ message: 'Registration failed.', error });
    }
})

router.post("/send-email-again", async (req, res) => {
    const token = req.headers?.authorization?.split(" ")[1]; //get token

    if (!token) return res.status(401).json({ error: "No token provided" });

    let decoded;
    try {
        decoded = jwt.verify(token, process.env.jwt_secret_code);
    } catch (err) {
        return res.status(403).json({ error: "Invalid or expired token" });
    }

    try {
        const { email } = req.body;
        const user = await newUsers.findOne({ email }); 

        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }

        await sendVerificationEmail(user);

        res.status(200).json({
            message: 'Verification email sent again. Please check your inbox.',
        });

    } catch (error) {
        console.error("Email Resend Error:", error);
        res.status(500).json({ message: 'Failed to send email.', error });
    }
});

export default router;
