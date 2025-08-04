import express from 'express';
const router = express.Router();
import twilio from 'twilio';

import jwt from 'jsonwebtoken';
import { newUsers } from '../../models/user.js';

const client = twilio(process.env.TWILIO_ACCOUNT_SID,process.env.TWILIO_AUTH_TOKEN);

router.post("/send-otp", async(req,res)=>{
    const token = req.headers?.authorization?.split(" ")[1]; //get token 
    if (!token) return res.status(401).json({ error: "No token provided" })
    
    try{
        const decoded = jwt.verify(token,process.env.jwt_secret_code);
        const userId = decoded.userId;

        const user = await newUsers.findOne({_id:userId}).select("mobileNumber");
        const phone = user.mobileNumber;
        const verifications = await client.verify.v2.services(process.env.TWILIO_VERIFY_SID)
                            .verifications.create({to:`${phone}`,channel:'sms'});
        res.json({success:true,status:verifications.status})                
    }
    catch(error){
        res.status(400).json({ success: false, error: error.message });
    }
})
export default router;