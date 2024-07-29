import express from "express";
import {getUser, login, logout, registerUser} from "../controllers/user.controller.js";
import { isAuthenticated } from "../middlewares/auth.middleware.js";
const userRouter = express.Router();
userRouter.route("/register").post(registerUser);
userRouter.route("/login").post(login);
userRouter.route("/logout").post(logout);
userRouter.route("/getUser/:id").get(getUser);
export default userRouter;