import mongoose, { Types } from "mongoose";

const categorySchema= new mongoose.Schema({
slug:{
    Type:String,
    required:true
},
url:{
    type:String,
    required:true
},
name:{
    type:String ,
    required:true
}
});

export const User=mongoose.model("category",categorySchema);