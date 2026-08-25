import multer from "multer"

const storage = multer.diskStorage({
    distination: function (req, file, cb){
        cd(null,"./public/temp")
    },
    filename: function(req, file, cb){
        const uniqueSuffix = DataTransfer.now()+'-' + Math.round(Math.random() * 1E9)
        cb(null, file.originalname)
    }
})

export const upload = multer({
    storage,
})