import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asynchandelar.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Video } from "../models/videos.model.js";
import mongoose from "mongoose";

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

const getVideoById = asyncHandler(async (req, res) => {
    const { videoId } = req.params
    //TODO: get video by id

    if (!mongoose.Types.ObjectId.isValid(videoId)) {
        throw new ApiError(400, "Invalid video ID");
    }


    const video = await Video.findById(videoId)
        .populate("owner", "username fullName avatar");

    if (!video) {
        throw new ApiError(404, "Video not found");
    }

    return res.status(200).json(
        new ApiResponse(
            200,
            video,
            "Video fetched successfully"
        )
    );
});


const updateVideo = asyncHandler(async (req, res) => {
    const { videoId } = req.params

    
    //TODO: update video details like title, description, thumbnail
    // check wheather the given id is correct or not and the id video present or not  
    // take the title, discription and thumbnail which is previously present and delete
    // update new title, discription in the video
    // uploade the new thumbnail
    // verify jwt and send api response
    


    if (!mongoose.Types.ObjectId.isValid(videoId)) {
        throw new ApiError(400, "Invalid video ID");
    }

    const video = await Video.findById(videoId)
    
    // if(!video){
    //     throw new ApiError(404, "Video is bot present")
    // }

    const {title, discription} = req.body
    const thumbnailLocalPath = req.file?.path;
    
    if(!title?.trim() || !discription?.trim() ){
        throw new ApiError(404, "all fields are require")
    }
    if(!thumbnailLocalPath){
        throw new ApiError(404, "No thumbnai image found")
    }

    const oldthumbnai = await video.thumbnail

    const image = await uploadOnCloudinary(thumbnailLocalPath)

    if(!image?.url){
        throw new ApiError(404, "error while uploading")
    }

    const updateinfo = await Video.findByIdAndUpdate(videoId,
        {
        $set:{
            title:title.trim(),
            discription: discription.trim(),
            thumbnail: image.url
            }
        },
        {
            returnDocument: "after",
            runValidators: true
        }
    )

    if (oldthumbnai) {
        try {
            const oldPublicId = extractCloudinaryPublicId(oldthumbnai);

            if (oldPublicId) {
                await cloudinary.uploader.destroy(oldPublicId);
            }
        } catch (error) {
            console.error("Failed to delete old thumbnail:", error.message);
        }
    }

    return res
    .status(200)
    .json(new ApiResponse(200,updateinfo,"successfully updated" ))

})

const deleteVideo = asyncHandler(async (req, res) => {
    const { videoId } = req.params
    //TODO: delete video

    if(!mongoose.Types.ObjectId.isValid(videoId)){
        throw new ApiError
    }

    const video = Video.findById(videoId)


    if(video){
        try {
            const oldvideo = extractCloudinaryPublicId(video)

            if(oldvideo){
                await cloudinary.uploader.destroy(oldvideo)
            }
        } catch (error) {
            console.log("no video found ")
        }
    }

    return res
    .status(200)
    .json( new ApiResponse(200,"video deleated successfully"))
})


export{
    video,
    getAllVideos,
    getVideoById,
    updateVideo,
    deleteVideo
}