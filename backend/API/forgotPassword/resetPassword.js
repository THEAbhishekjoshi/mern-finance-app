import express from 'express';
const router = express.Router();
router.use(express.json());

import { newUsers } from '../../models/user.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

router.post("/resetpassword", async (req, res) => {
    const authHeader = req.headers?.authorization;
    const token = authHeader && authHeader.split(" ")[1]; // Bearer <token>

    if (!token) return res.status(401).json({ error: "No token provided" });

    let decoded;
    try {
        decoded = jwt.verify(token, process.env.JWT_SECRET3);
    } catch (err) {
        return res.status(403).json({ error: "Invalid or expired token" });
    }

    const { confirmPassword } = req.body;
    const userEmail = decoded.email;

    if (!userEmail) return res.status(400).json({ error: "Token missing email" });

    try {
        const hashedNewPassword = await bcrypt.hash(confirmPassword, 10);
        await newUsers.updateOne(
            { email: userEmail },
            { $set: { password: hashedNewPassword } }
        );

        res.status(200).json({ message: 'Password reset successful.' });
    } catch (error) {
        res.status(500).json({ message: 'Password reset failed.', error });
    }
});

export default router