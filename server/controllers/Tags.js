const Tag = require("../models/tag");

const createTag = async(req,res) =>{
    try {
            const {name,description} = req.body;
        
            if(!name || !description){
                return res.status(401).json({
                    success:false,
                    message:"name and description are mandatory..!!!"
                })
            }
        
            const newTag = await Tag.create({
                name:name,
                description:description,
            })
        
            return res.status(200).json({
                success:true,
                message:"Tag created successfully..!!!"
            })
    } catch (error) {
        return res.status(500).json({
            success:false,
            message:"Tag cannot be created..!!!"
        })
    }

}

const getAllTags = async(req,res) =>{
    try{
        const allTags = await Tag.find({});
        return res.status(200).json({
            success:true,
            message:"All tags returned successfully..!!!",
            allTags,
        })
    }
    catch(error){
        return res.status(500).json({
            success:false,
            message:error.message,
        })
    }
}