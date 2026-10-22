import mongoose,{Schema} from "mongoose";
import { comments } from "./comments.model";

const likesSchema = new Schema({
    comment:{
        type: Schema.Types.ObjectId,
        ref: "comments"
    },
    video: {
        type: Schema.Types.ObjectId,
        ref: "Video"
    },
    
    likedBy:{
            type: Schema.Types.ObjectId,
            ref: "User"
    },
    tweet:{
        type: Schema.Types.ObjectId,
        ref: "tweets"
    }
},{timestamps:true})

export const likes = mongoose.model("likes",likesSchema)