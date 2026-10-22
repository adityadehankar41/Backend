// import {v2 as cloudinary} from "cloudinary"
// import fs from "fs"

// cloudinary.config({
//     cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
//     api_key: process.env.CLOUDINARY_API_KEY, 
//     api_secret: process.env.CLOUDINARY_API_SECRET
// })

// const uploadOnCloudinary = async (localFilePath) => {
//     try {
//         if (! localFilePath) return null
//         // upload the file on cloudinary
//         const response = await cloudinary.uploader.upload(localFilePath, {
//             resource_type: "auto"
//         })
//         // file has been uploaded successfull
//         // console.log("file is uploaded on cloudinary", response.url);

        
//         return response
//     }
//      catch (error) {
//         console.log("cloudinary upload error", error);
        
//         fs.unlinkSync(localFilePath)  // remove the locally saved temporary file as the upload operation got failed 

//     //     if (fs.existsSync(localFilePath)) {
//     //     fs.unlinkSync(localFilePath);
//     // }

//         return null;
//     }
    
// }

// export {uploadOnCloudinary}


import { v2 as cloudinary } from "cloudinary";
import fs from "node:fs/promises";
import "dotenv/config";

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

const uploadOnCloudinary = async (localFilePath) => {
    if (!localFilePath) {
        return null;
    }

    try {
        const response = await cloudinary.uploader.upload(localFilePath, {
            resource_type: "auto",
        });

        console.log("Image uploaded:", response.secure_url);

        return response;
    } catch (error) {
        console.error("Cloudinary upload failed:", error.message);
        console.error("HTTP code:", error.http_code);

        return null;
    } finally {
        try {
            await fs.unlink(localFilePath);
            console.log("Temporary file deleted successfully.");
        } catch (error) {
            if (error.code !== "ENOENT") {
                console.error("Could not delete temporary file:", error.message);
            }
        }
    }
};

export { uploadOnCloudinary };