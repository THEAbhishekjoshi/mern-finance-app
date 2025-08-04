import express from 'express';
const router = express.Router();
router.use(express.json());
import bcrypt from 'bcrypt';
import { newUsers } from '../../models/user.js';
import validateUserInput from '../../middlewares/validateUserInput.js';

router.post('/signup',validateUserInput,async(req,res)=>{
    try{
        req.body.email = req.body.email.toLowerCase();
        const {fullname,email,password} = req.body;
        const existingUser = await newUsers.findOne({email});
        if(existingUser){
            return res.status(400).json({
                "message": "User already exists"
            })
        }
        //hash password
        const hashedPassword= await bcrypt.hash(password,10);
        //now add the user details in user db
        await newUsers.create({fullname,email,password:hashedPassword});
        res.status(200).json({
            "message" : "User created successfully"
        })
    }
    catch(error){
        res.status(500).json({
            "message": "Signup failed",
            "error": error.message
        })
    }
});
export default router;