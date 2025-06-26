import mongoose from "mongoose";


const productSchema= new  mongoose.Schema({
    title:{
        type:String,
        required:true,
        trim:true
    }
    ,
    price:{
        type:Number,
        required:true,
        
    },


    
});




export const product=mongoose.model("product",productSchema);


