const User = require("../models/User");
const mailSender = require("../utils/mailSender.js");

const resetPasswordToken = async (req,res) =>{
    try{
        const {email}=req.body;
        const user=await User.findOne(email);

        if(!user){
            return res.json({
                success:false,
                message:'Your Email is not registered with us'
            });
        }

        const token=crypto.randomUUID();

        const updateDetails = await User.findOneAndUpdate(
            {email:email},
            {
                token:token,
                resetPasswordExpires:Date.now()+5*60*1000
            },
            {new:true}
        )

        const url=`http://localhost:3000/update-password/${token}`

        await mailSender(email,"Password Reset Link",`Password Reset Link : ${url}`);

        return res.json({
            success:true,
            message:'Email sent successfully, please check email and change pwd',
        });

    }
    catch(error){
        console.log(error);
        return res.status(500).json({
            success:false,
            message:"Something went wrong while sending reset pwd mail"
        })
    }
}
