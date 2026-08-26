import express from "express"
import cors from cors
import cookieParser from "cookie-parser"


const app = express()

app.use(cors({
    origin: process.env.CORS_ORICIN,
    Credentials: true
}))

app.use(express.json({limit:"16kb"}))// this is to get data from form json
app.use(express.urlencoded({extended:true, limit:"16kb"})) //this is use to get url data
app .use(express.static("public")) // this is for images or file or any thing to store in our device
app.use(cookieParser()) //this is for cookis from userbrowser



// app.use(express.json())
export {app}