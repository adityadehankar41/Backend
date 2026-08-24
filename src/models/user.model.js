import mongoose, {Schema} from "mongoose"

const userSchema = new Schema({
    username:{
        type: String
    }

})



export const User = mongoose.model("User", userSchema)