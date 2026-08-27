import { asyncHandler } from "../utils/asynchandelar.js";
import {ApiError} from  "../utils/ApiError.js"
import {uploadOnCloudinary} from "../utils/cloudinary.js"
import { User } from "../models/user.model.js";
import { ApiResponse } from "../utils/ApiResponse.js";

const registerUser = asyncHandler( async(req, res)=>{
     // get user details from frontend 
     // validation - not empty
     // check if user alredy exists: username, email
     // check for image, check for avatar 
     // upload them to cloudinary, avatar 
     // create user object - create entry in db
     // remove password and refresh token field from response
     //check for user creation
     // return res 

    const {fullName, email, username, passward} = req.body
    console.log("email: ", email)

    // if (fullName=== ""){
    //     throw new ApiError(400, "require full name")
    // }

    if (
        [fullName, email,username,passward].some((field)=>field?.trim() === "")
    ){
        throw new ApiError(400, "All friels are required ")
    }

    const existedUser = User.findOne({
        $or: [{username},{email}]
    })

    if (existedUser){
        throw new ApiError(409, "user alredy exist ")
    }

    const avatarLocalPath = req.files?.avatar[0]?.path;
    const CoverImageLocalPath =req.files?.coverImage[0]?.path

    if (!avatarLocalPath){
        throw new ApiError(400,"Avatar file is require ")
    }

    const avatar = await uploadOnCloudinary(avatarLocalPath)
    const coverImage = await uploadOnCloudinary(CoverImageLocalPath)

    if (!avatar){
        throw new ApiError(400,"Avatar file is require ")
    }

    const user = await User.create({
        fullName,
        avatar: avatar.url,
        coverImage: coverImage?.url || "",
        email,
        password,
        username: username.toLowerCase()
    })

    const createdUser = User.findById(user._id).select(
        "-password -refreshToken" //use to remove fild
    )

    if(!createdUser){
        throw new ApiError(500,"Something wemt wrong while regustarting the user")
    }

    return res.status(201).json(
        new ApiResponse(200, createdUser, "User registure successfully")
    )

})

export {registerUser}