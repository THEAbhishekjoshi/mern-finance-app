import express from 'express'
const router = express.Router();
router.use(express.json())
import bcrypt from 'bcrypt'
import { newUsers } from '../../models/user.js'
import emailExistMiddleware from '../../middlewares/emailExistMiddleware.js'
import jwt from 'jsonwebtoken';

router.post("/login", emailExistMiddleware, async (req, res) => {
    try {
        const { email, password, rememberMe } = req.body
        const user = await newUsers.findOne({ email }).select("password fullname email loginStepsCompleted");
        if (!user) return res.status(404).json({ message: "User not found" });

        //sending token 
        const expiredTIme = rememberMe ? '7d' : '6h'
        const token = jwt.sign({ userId: user._id }, process.env.jwt_secret_code, { expiresIn: expiredTIme })
        const isPassword = await bcrypt.compare(password, user.password);
        const { password: _, ...safeUser } = user._doc; // remove password
        //const user = await newUsers.findById(decoded.userId).select("-password"); // Exclude password
        if (isPassword) {
            return res.status(200).json({
                token,
                loginStepsCompleted:user.loginStepsCompleted,
                message: "Login Succesful",
                safeUser
            })
        }

        else {
            return res.status(401).send("Password is Incorrect")
        }

    }
    catch (error) {
        res.status(500).json({
            "message": "Login failed",
            "error": error.message
        })
    }
})

export default router;

