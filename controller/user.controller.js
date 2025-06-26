import{validationResult} from 'express-validator';
import { User } from '../models/user.model.js';
import bcrypt from 'bcryptjs';
import nodemailer from 'nodemailer';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

const usercontroller={
    async SignUp(request,response){
        try{
        const Errorvalidatio=validationResult(request);
       
        if(!Errorvalidatio.isEmpty()){
            return response.status(401).json({message:"bad Resquest"});


        }
       let{name,email,password,contect}=request.body;
const salt=bcrypt.genSaltSync(12);

password=bcrypt.hashSync(password,salt);
let result=await User.create({name,email,password,contect});


await sendEmail(email,name);
return response.status(201).json({message:"user create successfull",user:result});

    }catch(error){
        console.log(error);
        return response.status(500).json({message:"Internal server Error:"})
    }

    }
,
////////////////////////////////2nd API///////////////////////////////////////////////////
 async verifyAcount(request,response){
    try{
        let{email}=request.body;
        let result=await User.updateOne({email},{$set:{isVerified:true}});
        return response.status(200).json({message:"Account Verification successfull"});
    }catch(err){
        return response.status(500).json({error:"internal server error"});
    }
 },
 /////////////////////authentication//////3rd api for login//////////////////////////////
  async login(request,response){
    try{
    let{email,password}=request.body;
    let user=await User.findOne({email});
    if(!user){
        return response.status(401).json({message:"Anuthorized user | Email not found"});
    }


    if(!user.isVerified){
        return response.status(401).json({error:"Uanuthorized User | account is not verified"});
    }

    let status=await bcrypt.compare(password,user.password);
    user.password=undefined;
    status&&response.cookie("token",generateToken(user.email,user._id,user.contact));
    return status ? response.status(200).json({message:"Sign in sucess ",user}):response.status(401).json({error:"Unathorized user |Invalid password"});

    
    }catch(error){
        console.log(error);
            return response.status(500).json({message:"internal server Probelm",error:error
        });

    }
    
  },
  /////////////////////get all data '////////////////////////
  async getData(request,response){
    try{
    let result=await User.find();
    return response.status(200).json({success:true,message:"data get Sucessfull ",data:result})

    }catch(error){
        response.status(500).json({
          success: false,
      message: "Server Error",
      error: error.message
     } )}
    },
///////////////////////////find by id /////////////////////////

async findbyid(request,response){
    try{
        let userId=request.params.id;

        let result=await User.findById(userId);
        if(!result){
            console.log(result);
            return response.status(404).json({message:"user not found"});

        }
        return response.status(201).json({message:"User find Sucessfull ",data:result})

    }catch(error){
        request.status(500).json({message:"internal server Error ",error:error});

    }
},
/////////////////////////////////////delebyId///////////////////////
async deletbyid(request,response){
    try{
    let userID=request.params.id;
    let result=await User.findOneAndDelete(userID);
    if(!result){
        return response.status(401).json({message:"user not found "});
    }
    return response.status(201).json({message:"User delet Sucessfull",data:result});

    }catch(Eror){
        console.log(Eror);
        return response.status(500).json({message:"internal sever problem chack ",error:Eror});
    }
},
///////////////////////////////logout user Api/////////////////////////////////////
async logout(request,response){
    try{
response.clearCookie("token");//res.clearCookie("token");
return response.status(201).json({success:true,message:"user Logout sucessfull"});

    }catch(Error){
        console.log(Error);
        return response.status(500).json({success:false,message:"internal server problem ",error:Error})

    }
},
////////////////////////////////updateUserbyDi/////////////////////////////API

async update(request,response){
    try{
        let Userid=request.params.id;

        let updateresult=await User.findByIdAndUpdate(Userid,{$set:request.body},{new:true});
        if(!updateresult){
            return response.status(401).json({message:"data not valid | User not Valid "});

        }
        return response.status(201).json({message:"user details Update Sucessfull ",data:updateresult});



    }catch(Error){
        console.log(Error);
        return response.status(500).json({message:"internal server Problem ",error:Error});

    }
}


  }

    // <form method="post" action="https://backendapi-mdb.onrender.com/user/verification">
            //   <input type="hidden" name="email" value="${email}"/>
            //   <button type="submit" style="background-color: dark; color:white; width:200px; border: none; border: 2px solid grey; border-radius:10px;">Verifyaccount</button>
            // </form>

  ///////////////////////send Email concept ok//////////////////////////////
const sendEmail = (email,name) => {
    return new Promise((resolve,reject)=>{
        let transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL,
                pass: process.env.EMAIL_PASSWORD   
            }
        });
    
        let mailOptions = {
            from: process.env.EMAIL,
            to: email,
            subject: 'Account Verification',
            html: `<h4>Dear ${name}</h4>
            <p>Thank you for registration. To verify account please click on below button</p>
        
            <a href="https://backendapi-mdb.onrender.com/user/verify?token=${token}"
   style="padding:10px 20px; background-color:#28a745; color:white; text-decoration:none; border-radius:5px;">
   Verify Account
</a>
            <p>
               <h6>Thank you</h6>
               Backend Api Team.
            </p>
            `
        };
        transporter.sendMail(mailOptions, function (error, info) {
            if (error) {
                reject(err);
            } else {
              resolve();
            }
        });
    });
    
}

  /////////////////////////end code //////////////////////////////////
const generateToken=(email,userId,contect)=>{
    let paylod={email,userId,contect};
    return jwt.sign(paylod.process.env.Token_SECRET);
}


export default usercontroller;