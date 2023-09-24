import DoctorSchema from "../models/DoctorSchema.js";

export const updateUserController = async (req, res) => {
    const id = req.params.id;
    try {
        const updatedUser = await DoctorSchema.findOne({ _id: id }, { $set: req.body }, { new: true })
        res.status(200).json({
            success: true,
            message: "Successfully updated",
            data: updatedUser
        });
    } catch (error) {
        console.log(error)
        res.status(500).json({
            success: false,
            message: "Error while update",
            error: error,
        });
    }
}

export const deleteUserController = async (req, res) => {
    const id = req.params.id;
    try {
        await DoctorSchema.findByIdAndDelete({ _id: id })
        res.status(200).json({
            success: true,
            message: "Successfully deleted",
        });
    } catch (error) {
        console.log(error)
        res.status(500).json({
            success: false,
            message: "Error while delete",
            error: error,
        });
    }
}

export const singleUserController = async (req, res) => {
    const id = req.params.id;
    try {
        const singleUser = await DoctorSchema.findById({ _id: id }).populate("reviews").select("-password")
        res.status(200).json({
            success: true,
            message: "Successfully fetched User",
            data: singleUser
        });
    } catch (error) {
        console.log(error)
        res.status(500).json({
            success: false,
            message: "Error while fetching single user",
            error: error,
        });
    }
}

export const getAllUserController = async (req, res) => {
    try {
        const { query } = req.query;
        let doctors;
        if (query) {
            doctors = await DoctorSchema.find(
                {
                    isApproved: "approved",
                    $or: [
                        { name: { $regex: query, $options: "i" } },
                        { specialization: { $regex:query,$options:"i" } }
                    ]
                }
            ).select("-password");
        }else{
            doctors = await DoctorSchema.find({isApproved: "approved"}).select("-password");
        }
        res.status(200).json({
            success: true,
            message: "Successfully fetched all User",
            data: doctors
        });
    } catch (error) {
        console.log(error)
        res.status(500).json({
            success: false,
            message: "Error while fetching all user",
            error: error,
        });
    }
}