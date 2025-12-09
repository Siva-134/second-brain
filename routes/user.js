const express=require('express');
const router=express.Router();

router.post("/register",async(req,res)=>{
    const text=req.body;
    console.log(text);
    res.send("registered sucess fully");
})

module.exports=router;