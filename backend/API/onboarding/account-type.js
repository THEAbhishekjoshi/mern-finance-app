import express from 'express'
const router = express.Router();
router.use(express.json())
import { newUsers } from '../../models/user.js'
import jwt from 'jsonwebtoken';

router.post("/account-type", async (req, res) => {
    const token = req.headers?.authorization?.split(" ")[1]; //get token 
    if (!token) return res.status(401).json({ error: "No token provided" })

    try {
        const { accountType} = req.body;
        const decoded = jwt.verify(token,process.env.jwt_secret_code);
        const userId = decoded.userId;

        await newUsers.updateOne({_id: userId}, {
            $set : {accountType}
        })

        // Respond with a success message
        res.status(200).json({ message: "Account type saved successfully", accountType });
    }
    catch (error) {
        console.error("Error saving account type:", error);
        res.status(500).json({ message: "Failed to save account type", error: error.message });
    }
});
export default router;