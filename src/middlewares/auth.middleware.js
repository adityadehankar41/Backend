import { User } from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asynchandelar.js";
import jwt from "jsonwebtoken"

export const verifyJWT = asyncHandler(async(req,res,next)=>{
    try {
        const token = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ", "") //this line is use to get only token and replace bearer and space to empty string 
    
        if (!token){
            throw new ApiError(401, "Unathorized request")
        }
    
        const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)  // this is use to decode the token and for this it require access tokrn secret 
        
        const user = await User.findById(decodedToken?._id).select("-password -refreshToken")
    
        if(!user ){
            throw new ApiError(401, "Invallid Access Token ")
        }
    
        req.user = user;
        next()
    } catch (error) {
        throw new ApiError(401, error?.message || "Invalid access token ")
    }


})