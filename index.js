import express, { json } from "express"
const server = express()
const port = 3000

//import packages
import cookieParser from "cookie-parser"
import cors from "cors"
import "dotenv/config"
import "./config/moongoseConnection.js"//connection with MongoDb

import authRouter from "./routes/authRouter.js"
import userRouter from "./routes/userRouter.js"
import notificationRouter from "./routes/notificationRouter.js"
import requestRouter from "./routes/requestRouter.js"

//middlewares
server.use(cookieParser())
server.use(cors({
    origin: 'http://localhost:5173',
    credentials: true
}))
server.use(json())

//routers
server.use("/",authRouter)
server.use("/user",userRouter)
server.use("/notification",notificationRouter)
server.use("/request",requestRouter)

server.listen(port, () => {
    console.log(`Server is running on Port ${port}`)
})