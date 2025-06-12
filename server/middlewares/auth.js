require("dotenv").config();
const User = require("../models/User.js");
const jwt = require("jsonwebtoken");

const auth = async(req,res)=>{
    try{
        const token=req.cookie.token || req.body.token || req.header("Authoization").replace("Bearer ","");

        if(!token){
            return res.status(401).json({
                success:false,
                message:"Token is missing"
            })
        }

        try{
            const decode = await jwt.verify(token,process.env.JWT_SECRET);
            req.user=decode;
            console.log(decode);
        }
        catch(error){
            return res.status(401).json({
                success:false,
                message:"token is invalid"
            })
        }

        next();
    }catch(error){
        res.status(500).json({
            success:false,
            message:"Something went wrong while registering the user..!!!"
        })
    }
}

const isStudent = (req,res,next) =>{
    try{
        if(req.user.accountType!=="Student"){
            return res.status(401).json({
                sucess:false,
                message:"This is a protected route for Student only..!!"
            })
        }

        next();
    }
    catch(error){
        res.staus(500).json({
            success:false,
            message:"User role cannot be verified,please try again"
        })
    }
}
const isInstructor= (req,res,next) =>{
    try{
        if(req.user.accountType!=="Instructor"){
            return res.status(401).json({
                sucess:false,
                message:"This is a protected route for Instructor only..!!"
            })
        }

        next();
    }
    catch(error){
        res.staus(500).json({
            success:false,
            message:"User role cannot be verified,please try again"
        })
    }
}
const isAdmin = (req,res,next) =>{
    try{
        if(req.user.accountType!=="Admin"){
            return res.status(401).json({
                sucess:false,
                message:"This is a protected route for Admin only..!!"
            })
        }

        next();
    }
    catch(error){
        res.staus(500).json({
            success:false,
            message:"User role cannot be verified,please try again"
        })
    }
}

module.exports = {auth,isStudent,isAdmin,isInstructor}