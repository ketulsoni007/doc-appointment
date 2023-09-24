import UserSchema from "../models/UserSchema.js";
import DoctorSchema from "../models/DoctorSchema.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

export const loginController = async (req, res) => {
   try {
      const requiredFields = ["email", "password"];
      const missingFields = requiredFields.filter(field => !(field in req.body));
      if (missingFields.length > 0) {
         return res.status(400).json({
            success: false,
            message: `${missingFields.join(", ")} is a required field(s)`,
         });
      }
      let user = null;
      const patient = await UserSchema.findOne({email:req.body.email});
      const doctor = await DoctorSchema.findOne({email:req.body.email});
      if(patient){
         user = patient;
      }
      if(doctor){
         user = doctor;
      }
      if(!user){
         return res.status(404).json({
            success:false,
            message:"User Not Found"
         })
      }
      const isPasswordMatch = await bcrypt.compare(req.body.password,user.password)
      if(!isPasswordMatch){
         return res.status(404).json({
            success:false,
            message : "Invalid Credentials"
         })
      }
      const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: "15d" });
      const {password,role,appointments,...rest} = user._doc;
      return res.status(200).json({
         success: true,
         message: "Successfully Login",
         data: {...rest},
         token,
         role
      });
   } catch (error) {
      console.log(error)
      res.status(500).json({
         success: false,
         message: "Error while login",
         error: error,
      });
   }
}

export const registerController = async (req, res) => {
   try {
      const requiredFields = ["name", "email", "password","role"];
      const missingFields = requiredFields.filter(field => !(field in req.body));
      if (missingFields.length > 0) {
         return res.status(400).json({
            success: false,
            message: `${missingFields.join(", ")} is a required field(s)`,
         });
      }
      const { name, email, password, role, photo, gender } = req.body;
      let user = null;
      if(role && role === "patient"){
         user = await UserSchema.findOne({email})
      }else if(role && role === "doctor"){
         user = await DoctorSchema.findOne({email});
      }
      if (user) {
         return res.status(400).json({
            success: false,
            message: "User already exists",
         });
      }
      const salt = await bcrypt.genSalt(10);
      const hashPassword = await bcrypt.hash(password,salt);
      if(role && role === "patient"){
         user = new UserSchema({
            name,
            email,
            password:hashPassword,
            photo,
            gender,
            role
         })
      }
      if(role && role === "doctor"){
         user = new DoctorSchema({
            name,
            email,
            password:hashPassword,
            photo,
            gender,
            role
         })
      }

      const savedUser = await user.save();
      
      return res.status(201).json({
         success: true,
         message: "User successfully created",
         data: savedUser,
      });
   } catch (error) {
      console.error(error);
      res.status(500).json({
         success: false,
         message: "Error creating user",
         error: error,
      });
   }
};

