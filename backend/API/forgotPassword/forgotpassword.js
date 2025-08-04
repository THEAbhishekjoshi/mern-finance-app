import express from 'express';
const router = express.Router();
router.use(express.json());
import { newUsers } from '../../models/user.js';
import sendResetEmail from '../utils/sendResetEmail.js';

router.post("/forgotpassword", async (req, res) => {
    try {
        const { email } = req.body
        const user = await newUsers.findOne({ email });
        if (!user) return res.status(404).json({ message: 'User not found' });

        await sendResetEmail(user);
        res.status(200).json({ message: 'Reset link sent. Please check your email.' });
    } catch (error) {
        res.status(500).json({ message: 'Error-:', error });
    }
})


export default router;
