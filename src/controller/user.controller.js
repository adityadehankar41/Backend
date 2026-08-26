import { asyncHandler } from "../utils/asynchandelar.js";


const registerUser = asyncHandler( async(req, res)=>{
    return res.status(200).json({
        message:"worke is done "
    })
})

export {registerUser}