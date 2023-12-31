import { Router } from "express";
import {registerController,loginController} from "../controllers/authController.js";

const authRoute = Router();

authRoute.post("/register",registerController)
authRoute.post("/login",loginController)

export default authRoute;