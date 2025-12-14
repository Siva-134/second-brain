const express=require('express');
const User = require('../models/user');
const router=express.Router();
const jwt=require('jsonwebtoken');

router.post('/register',async(req,res)=>{
    try{
        const {name,email,password}=req.body;

        if(!name||!email||!password){
            return res.status(400).json({ message: "Required Fields Missing" });
        }

        const newUser=new User({
            name:name,
            email:email,
            password:password
        });

        await newUser.save();
        
        // Auto-login: Generate token immediately
        const token = jwt.sign({_id: newUser._id}, "ramesh2317");

        res.status(201).json({
            message: "User Registered Successfully",
            token: token
        });

    }catch(error){
        console.log(error);
        return res.status(500).json({ message: "Error registering user", error });
    }
});


router.post("/login",async(req,res)=>{
    try{
        const{email,password}=req.body;

        const isUserExist=await User.findOne({email:email});

        if(!isUserExist){
            return res.status(400).json({ message: "User does not exist" });
        }

        if(isUserExist.password!=password){
            return res.status(401).json({ message: "Invalid Credentials" });
        }

        const userId=isUserExist._id;
        const token=jwt.sign({_id:userId},"ramesh2317");
        console.log(token);
        
        // Return token in response body for frontend to save in localStorage
        return res.json({
            message: "User LoggedIn Sucessfully",
            token: token
        });
    }catch(error){
        return res.send("Error",error);
    }
});

router.get("/search", async (req, res) => {
    try {
        const { q } = req.query;
        if (!q) return res.json({ users: [] });

        const users = await User.find({
            $or: [
                { name: { $regex: q, $options: 'i' } },
                { email: { $regex: q, $options: 'i' } }
            ]
        }).select('name email _id').limit(5);

        res.json({ users });
    } catch (e) {
        res.status(500).json({ message: "Error searching users" });
    }
});

router.post('/logout', (req, res) => {
    res.clearCookie('token');
    res.json({ message: "Logged out successfully" });
});

module.exports = router;