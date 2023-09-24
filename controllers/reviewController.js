import DoctorSchema from "../models/DoctorSchema.js";
import ReviewSchema from "../models/ReviewSchema.js";
import dotenv from "dotenv";

dotenv.config();

export const getAllReviewsController = async (req, res) => {
    try {
        const reviews = await ReviewSchema.find({});
        res.status(200).json({
            success: true,
            message: "reviews fetched successfully",
            data: reviews
        })
    } catch (error) {
        console.log(error)
        res.status(500).json({
            success: false,
            message: "Error while fetching reviews",
            error: error,
        });
    }
};

export const createReviewsController = async (req, res) => {
    if (!req.body.doctor) {
        req.body.doctor = req.params.doctorId
    }
    if (!req.body.user) {
        req.body.user = req.params.userId
    }
    const newReview = new ReviewSchema(req.body);
    try {
        const savedReview = await newReview.save();
        await DoctorSchema.findByIdAndUpdate(req.body.doctor, {
            $push: {
                reviews: savedReview._id
            }
        })
        res.status(200).json({
            success: true,
            message: "Review Submitted Succesfully",
            data: savedReview
        })
    } catch (error) {
        console.log(error)
        res.status(500).json({
            success: false,
            message: "Error while fetching reviews",
            error: error.message,
        });
    }
}