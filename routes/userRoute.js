import { Router } from "express";
import { updateUserController,singleUserController,getAllUserController,deleteUserController } from "../controllers/userController.js";
import { authenticate, restrict } from "../auth/verifyToken.js";

const userRoute = Router();

userRoute.put("/update/:id",authenticate,restrict(["patient"]),updateUserController)
userRoute.get("/single-user/:id",authenticate,restrict(["patient"]),singleUserController)
userRoute.get("/all-users",authenticate,restrict(["admin"]),getAllUserController)
userRoute.delete("/delete-user/:id",authenticate,restrict(["patient"]),deleteUserController)

export default userRoute;