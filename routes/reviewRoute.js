import { Router } from "express";
import { createReviewsController, getAllReviewsController } from "../controllers/reviewController.js";
import { authenticate, restrict } from "../auth/verifyToken.js";

const reviewRoute = Router();

const router = reviewRoute.merge({mergeParams:true});

reviewRoute.route("/")
.get(getAllReviewsController)
.post(authenticate,restrict(["patient"]),createReviewsController)

export default reviewRoute;