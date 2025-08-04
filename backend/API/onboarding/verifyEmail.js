import jwt from 'jsonwebtoken';
import { newUsers } from '../../models/user.js';
import express from 'express';
const router = express.Router();

router.get('/verify-email', async (req, res) => {
  try {
    const { token } = req.query;
    const decoded = jwt.verify(token, process.env.JWT_SECRET2);

    if (!decoded?.id) return res.status(400).json({ error: 'Invalid token payload' });

    const user = await newUsers.findById(decoded.id);
    if (!user) return res.status(404).json({ error: 'User not found' });

    // user.isEmailVerified = true;
    // user.loginStepsCompleted = true;
    // user.emailVerifiedAt = new Date(); // optional timestamp
    // await user.save();

    await newUsers.updateOne({_id:user._id},{
      $set:{
        isEmailVerified: true,
        loginStepsCompleted: true,
        accountCreatedAt:new Date()
      }
    })

    res.status(200).json({ message: 'Email verified successfully!'});
  } catch (err) {
    res.status(400).json({ error: 'Invalid or expired token' });
  }
});

export default router;
