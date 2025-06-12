const User=require("../models/User.js");
const OTP=require("../models/OTP.js");
const otpGenerator = require("otp-generator");

const sendOTP = async(req,res) =>{
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

}

module.exports = {sendOTP}