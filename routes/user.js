const express=require('express');
const User = require('../models/user');
const router=express.Router();
const jwt=require('jsonwebtoken');

router.post('/register',async(req,res)=>{
    try{
        const {name,email,password}=req.body;

        if(!name||!email||!password){
            res.send("Required Fileds Missing");
        }

        const newUser=new User({
            name:name,
            email:email,
            password:password
        });

        await newUser.save();
        res.send("User Registered Sucessfully");

    }catch(error){
        console.log(error);
        return res.send("Error",error);
    }
});


router.post("/login",async(req,res)=>{
    try{
        const{email,password}=req.body;

        const isUserExist=await User.findOne({email:email});

        if(!isUserExist){
            return res.send("User does not exist");
        }

        if(isUserExist.password!=password){
            return res.send("Unauthorized  Credentials");
        }

        const userId=isUserExist._id;
        const token=jwt.sign({_id:userId},"ramesh2317");
        console.log(token);
        res.cookie('token',token);
        return res.send("User LoggedIn Sucessfully");
    }catch(error){
        return res.send("Error",error);
    }
});

module.exports=router;