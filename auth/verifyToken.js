import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import UserSchema from "../models/UserSchema.js";
import DoctorSchema from "../models/DoctorSchema.js";

dotenv.config();

export const authenticate = async (req, res, next) => {
    const authToken = req.headers.authorization;
    if (!authToken || !authToken.startsWith("Bearer")) {
        return res.status(401).json({ success: false, message: "No token provided" });
    }
    try {
        const token = authToken.split(" ")[1]
        const decoded = jwt.verify(token,process.env.JWT_SECRET);
        req.userId = decoded.id;
        req.role = decoded.role;
        next();
    } catch (error) {
        console.error(error);
        if(error && error.name === "TokenExpiredError"){
            return res.status(401).json({
                success: false,
                message: "Token is Expired Please Login Again",
                error: error,
            });
        }
        return res.status(500).json({
            success: false,
            message: "Error checking user",
            error: error,
        });
    }
}

export const restrict = roles => async(req,res,next)=>{
    const userId = req.userId
    let user;
    const patient = await UserSchema.findById(userId);
    const doctor = await DoctorSchema.findById(userId);
    if(patient){
        user = patient 
    }
    if(doctor){
        user = doctor 
    }
    if(!roles.includes(user.role)){
        return res.status(401).json({
            success :false,
            message:"You are not authorized to perform this action."
        });
    }
    next();
}
