import { Router } from "express";
import { createReviewsController,getAllReviewsController } from "../controllers/reviewController.js";
import { authenticate, restrict } from "../auth/verifyToken.js";

const reviewRoute = Router();

reviewRoute.post("/create",authenticate,restrict(["patient"]),createReviewsController)
reviewRoute.get("/get",getAllReviewsController)

export default reviewRoute;