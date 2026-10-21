import { Router } from "express";
import { changeCurrentPassword, 
    getCurrentUser,
    
getUserChannelProfile, getWatchHistory, loginUser, logoutUser, registerUser, updateAccountDetails, updateUserAvatar, updateUserCoverImage, refreshAccessToken} from "../controller/user.controller.js";
import { upload } from "../middlewares/multer.middleware.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router()

router.route("/register").post(
    upload.fields([
        {
            name: "avatar",
            maxCount: 1
        },
        {
            name: "coverImage",
            maxCount: 1
        }
    ]),
    registerUser)

router.route("/login").post(loginUser)

// secured rout
router.route("/logout").post(verifyJWT,logoutUser)

router.route("/refresh-token").post(refreshAccessToken)

router.route("/change-password").post(verifyJWT,changeCurrentPassword)

router.route("/current-user").get(verifyJWT,getCurrentUser)

router.route("/update-account").patch(verifyJWT,updateAccountDetails)  // patch is use to update to spacific details only

router.route("/avatar").patch(verifyJWT,upload.single("avatar"), updateUserAvatar)  //single is use to update the single unit only 

router.route("/cover-image").patch(verifyJWT,upload.single("coverImage"), updateUserCoverImage)

// as in this we have used params so use rout like this 
router.route("/c/:username").get(verifyJWT,getUserChannelProfile)

router.route("/history").get(verifyJWT, getWatchHistory)


export default router