import jwt from "jsonwebtoken"
import User from "../models/User.js";

export const auth = async(req, res, next) => {
    try {
        
        const token = req.cookies?.verificationToken || req.header("Authorization")?.replace("Bearer ", "")
        
        if (!token) {
            return res.status(401).json({success: false, message: "Please Login First", data: {}})
        }
        // console.log("Token: ", token);
        
        const decodedToken = jwt.verify(token, process.env.JWT_SECRET)
        const user = await User.findById(decodedToken?._id).select("-password -refreshToken")
    
        if (!user) {
            return res.status(401).json({success: false, message: "Invalid Verification Token", data: {}})
        }
    
        req.user = user;
        next()
    } catch (error) {
        console.log("Error: ", error)
        return res.status(401).json({success: false, message: "Invalid verification token", data: {}})
    }   
}