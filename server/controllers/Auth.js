const User=require("../models/User.js");
const OTP=require("../models/OTP.js");
const otpGenerator = require("otp-generator");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const {mailSender} = require("../utils/mailSender.js")
require("dotenv").config();


const sendOTP = async(req,res) =>{
    try{
            const {email}=req.body;

            const isEmailPresent = await User.findOne({email});

            if(isEmailPresent){
                res.status(401).json({
                    status:false,
                    message:"User already registered..!!!"
                })
            }

            let otp = otpGenerator.generate(6,{
                upperCaseAlphabets:false,
                lowerCaseAlphabets:false,
                specialChars:false
            })

            console.log("otp : ",otp);

            let result=await OTP.findOne(otp);

            while(result){
                otp = otpGenerator.generate(6,{
                    upperCaseAlphabets:false,
                    lowerCaseAlphabets:false,
                    specialChars:false
                })
                result=await OTP.findOne(otp);
            }

            const payLoad = {email,otp};

            const otpBody=await OTP.create(payLoad);
            console.log(otpBody);

            res.status(200).json({
                success:true,
                message:"OTP sent successfully..!!!",
                otp,
            })
    } catch(error){
        return res.status(200).json({
            success:false,
            message:"OTP cannot be sent..!!!"
        })
    }

}

const signup = async(req,res) =>{

    try {
            const {
                firstName,
                lastName,
                email,
                password,
                confirmPassword,
                accountType,
                contactNumber,
                otp
            } = req.body;
        
            if(!firstName || !lastName || !email || !password || !confirmPassword || !otp){
                return res.status(403).json({
                    success:false,
                    message:"All fields are required..!!!"
                })
            }
        
            if(password !==confirmPassword){
                return res.status(401).json({
                    success:false,
                    message:"password and confirm password does not match..!!!"
                })
            }
        
            const userAlreadyPresent = await User.findOne({email});
        
            if(userAlreadyPresent){
                return res.status(401).json({
                    success:false,
                    message:"user already present..!!!"
                })
            }
        
            const latestOtpInDatabase = await OTP.find({email}).sort({createdAt:-1}).limit(1);
        
            if(latestOtpInDatabase.length==0){
                res.status(400).json({
                    success:false,
                    message:"OTP not found"
                })
            }
            else if(otp!==recentOtp.otp){
                return res.status(400).json({
                    success:false,
                    message:"Invalid OTP"
                })
            }
        
            const hashedPassword=await bcrypt.hash(password,10);
        
            const profileDetails = await Profile.create({
                gender:null,
                dateOfBirth:null,
                about:null,
                contactNumber:null,
            })
        
            const user=await User.create({
                firstName,
                lastName,
                email,
                contactNumber,
                password:hashedPassword,
                accountType,
                additionalDetails:profileDetails._id,
                image:`https://api.dicebear.com/5.x/initials/svg?seed=${firstname} ${lastName}`
            })
        
            return res.status(200).json({
                success:true,
                data:user,
                message:"User is registered Successfully..!!!"
            })
    } catch (error) {
        res.status(500).json({
            success:false,
            message:"internal server error..!!!"
        })
    }

}

const login = async(req,res) =>{
    try {
        const {email,password} = req.body;
        
        if(!email || !password){
            return res.status(401).json({
                success:false,
                message:"Email and password both are required..!!!"
            })
        }

        const user=await User.findOne({email});
        if(!user){
            res.status(401).json({
                success:false,
                message:"email does not exists..!!!"
            })
        }

        if(await bcrypt.compare(password,user.password)){
            const payLoad = {
                email:user.email,
                id:user._id,
                accountType:user.accountType
            }

            const token=jwt.sign(payLoad,process.env.JWT_TOKEN,{
                expiresIn:"2h"
            });

            user.token=token;
            user.password=undefined;

            const options = {
                expires: new Date(Date.now() + 3*24*60*60*1000),
                httpOnly:true
            }

            res.cookie("token",token,options).status(200).json({
                success:true,
                token,
                user,
                message:"Logged in successfully..!!!"
            })

        }
        else{
            return res.status(401).json({
                success:false,
                message:"Password is incorrect..!!!"
            })
        }
    }
    catch(error) {
        return res.status(500).json({
            success:false,
            message:"User cannot be login..!!!"
        })
    }
}

const changePassword = async(req,res) =>{

    try {
        const {oldPassword,newPassword,confirmPassword} = req.body;
    
        if(!oldPassword || !newPassword || !confirmPassword){
            return res.status(401).json({
                success:false,
                message:"oldPassword, newPassword and confirmPassword all are required..!!!"
            })
        }
    
        if(newPassword!==confirmPassword){
            return res.status(401).json({
                success:false,
                message:"newPassword and confirmPassword does not match..!!!"
            })
        }
    
        const user=req.user;
        if(await bcrypt.compare(oldPassword,user.password)){
            user.password = await bcrypt.hash(newPassword,10);
        
            await user.save();
        
            mailSender()

            return res.status(200).json({
                success:true,
                message:"Password changed and otp sent successfully..!!!"
            })

        }
        else{
            return res.status(500).json({
                success:false,
                message:""
            })
        }

    

} catch (error) {
    return res.status(500).json({
        success:false,
        message:"Password cannot be changed..!!!"
    })
}

}

module.exports = {sendOTP,signup,login,changePassword}