const asyncHandler = (requestHendler) =>{
    (req, res, next) =>{
        Promise.resolve(requestHendler(req, res, next)).catch((err)=> next(err))
    }
}

// const asyncHandler = (fn)=> async(rew, res, next)=> {
//     try {
//         await fn(req, res, next)
//     } catch (error) {
//         res.status(error.code || 500).json({
//             success: false,
//             message: error.message
//         })
//     }
// }

export {asyncHandler}