import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();
const auth=(req,res,next)=>{
    try{
        let{token}=req.cookies;
        if(!token) throw new Error("Invlid Error ");
        const decoded=jwt.verify(token,process.env.SECKRET_KEY);
        req.userid=decoded.userid;
        next();

    }catch(Error){
        console.log("Auth Error ",Error);
        return res.status(401).json({message:"Unathorize User ",error:error.message});
       
    }
}



