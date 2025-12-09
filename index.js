const express=require('express');
const app=express();
const userRoutes=require('./routes/user');
const { mongoose } = require('mongoose');

app.use(express.json());

app.use('/api/v1/',userRoutes);

mongoose.connect("mongodb://localhost:27017/brainly");

app.listen(3000,()=>{
    console.log("server running on 3000...");
})