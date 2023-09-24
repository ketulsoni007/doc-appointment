import { Router } from "express";
import { updateUserController,singleUserController,getAllUserController,deleteUserController } from "../controllers/doctorController.js";
import { authenticate, restrict } from "../auth/verifyToken.js";
import reviewRoute from "./reviewRoute.js";

const doctorRoute = Router();
doctorRoute.use("/:doctorId/reviews",reviewRoute)
doctorRoute.put("/update/:id",authenticate,restrict(["doctor"]),updateUserController)
doctorRoute.get("/single-user/:id",singleUserController)
doctorRoute.get("/all-users",getAllUserController)
doctorRoute.delete("/delete-user/:id",authenticate,restrict(["doctor"]),deleteUserController)

export default doctorRoute;