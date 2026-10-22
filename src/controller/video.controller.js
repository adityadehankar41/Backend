import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asynchandelar.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Video } from "../models/videos.model.js";


const video = asyncHandler(async(req,res)=>{
    //thumbnail, title, description, of the video require 
    //check the all three must be present 
    // check thumbnail image should be uploaded properly
    // uplode the video to cloudinary 
    //check wheather it is correctly uploaded or not 
    // give response 

    const {title, description,duration,views} = req.body
    const owner = req.user._id;

    if(! title){
        throw new ApiError(404, "Title require")
    }

    const thumbnailPath = req.files?.thumbnail[0]?.path

    if(!thumbnailPath){
        throw new ApiError(404, "thumbnail image is require")
    }
      
    const thumbnail  = await uploadOnCloudinary(thumbnailPath)
    
    if(!thumbnail.url){
        throw new ApiError(404, "thumbnail image did not uploaded to cloudinary")
    }

    const videopath = req.files?.video[0]?.path;
    if(!videopath){
        throw new ApiError(404, "No video present")
    }

    const video = await uploadOnCloudinary(videopath);

    // Check whether upload succeeded
    if (!video?.secure_url) {
        throw new ApiError(500, "Error while uploading video to Cloudinary");
    }

    const savedVideo = await Video.create({
        title,
        description,
        videoFile: video.secure_url,
        thumbnail: thumbnail.secure_url,
        owner,
        duration,
        views
    });

    return res
    .status(200)
    .json(new ApiResponse(200, savedVideo,"video successfully uploades"))
})


const getAllVideos = asyncHandler(async (req, res) => {
    const { page = 1, limit = 10, query, sortBy, sortType, userId } = req.query
    //TODO: get all videos based on query, sort, pagination
})



export{
    video,
    getAllVideos
}