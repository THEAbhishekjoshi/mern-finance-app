import express from 'express'
const router = express.Router();
router.use(express.json())
import { newUsers } from '../../models/user.js'
import jwt from 'jsonwebtoken';




router.post("/country", async (req, res) => {
    const token = req.headers?.authorization?.split(" ")[1]; //get token 
    if (!token) return res.status(401).json({ error: "No token provided" })

    try {
        const { country} = req.body;
        const decoded = jwt.verify(token,process.env.jwt_secret_code);
      
        const userId = decoded.userId;

        const str = await newUsers.updateOne(
            {_id:userId}, 
            { $set : {country} }
        )
        console.log(str)

        // Respond with a success message
        res.status(200).json({ message: "Country name  saved successfully", country });
    }
    catch (error) {
        console.error("Error saving account type:", error);
        res.status(500).json({ message: "Failed to save Country name", error: error.message });
    }
});
export default router;