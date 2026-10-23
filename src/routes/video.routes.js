import { Router } from "express";
import {verifyJWT} from "../middlewares/auth.middleware.js"
import { getVideoById, updateVideo, video ,deleteVideo} from "../controller/video.controller.js";
import { upload } from "../middlewares/multer.middleware.js";
const router = Router()
router.use(verifyJWT); // Apply verifyJWT middleware to all routes in this file

router.route("/videofill").post(
    verifyJWT,
    upload.fields([
        {
            name: "video",
            maxCount: 1
        },{
            name:"thumbnail",
            maxCount:1
        }
    ]),
    video
);
router.route("/getvideo").get(getVideoById)
router.route("/:videoId").patch(verifyJWT,upload.single("thumbnail"),updateVideo)
router.route("/tobedeleated/:videoId").post(verifyJWT,deleteVideo)

export default router