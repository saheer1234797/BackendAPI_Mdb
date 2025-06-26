import mongoose from "mongoose";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import userRouter from './routes/user.route.js'
import express from 'express';
import dotenv from 'dotenv';
import { Result } from "express-validator";
dotenv.config();
const app=express();
mongoose.connect(process.env.MONGO_URL).then(Result=>{
    app.use(cookieParser());
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({extended:true}));
    app.use('/user',userRouter);
    app.listen(process.env.PORT || 3000,()=>{
        console.log("server started ......");
    });
}).catch(Err=>{
    console.log("data baese not conected ...");
})

