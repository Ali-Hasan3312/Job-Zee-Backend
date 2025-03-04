import express from "express"
import dotenv from "dotenv"
import cors from "cors"
import cookieParser from 'cookie-parser'
import fileUpload from "express-fileupload"
import userRouter from "./routes/userRouter.js"
import applicationRouter from "./routes/applicationRouter.js"
import jobRouter from "./routes/jobRouter.js"
import { connectDB } from "./db/database.js"
import { errorMiddleware } from "./middlewares/error.middleware.js"
const app = express();
dotenv.config({path: "./config/config.env"})
const port = process.env.PORT;
connectDB();
const corsOptions = {
    origin: process.env.FRONTEND_URL,
    credentials: true
};

app.use(cors(corsOptions));
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(fileUpload({
    useTempFiles:true,
    tempFileDir: "/tmp/"
}))
app.listen(port,()=>{
    console.log(`Server is running on port ${port}`);
});
app.use("/api/v1/user",userRouter)
app.use("/api/v1/application",applicationRouter)
app.use("/api/v1/job",jobRouter)
app.use(errorMiddleware)
