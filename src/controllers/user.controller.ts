import { AuthenticatedRequest } from "../middlewares/auth.middleware.js";
import { TryCatch } from "../middlewares/error.middleware.js";
import { User, UserDocument } from "../models/user.model.js";
import ErrorHandler from "../utils/errorHandler.js";
import { sendToken } from "../utils/jwtToken.js";
import { Request, Response, NextFunction } from "express";

export const registerUser = TryCatch(async (req: Request, res: Response, next: NextFunction) => {
  const { name, email, phone, role, password } = req.body;
  
  if (!name || !email || !phone || !role || !password) {
    return next(new ErrorHandler("All fields are required", 401));
  }  
 const existedUser = await User.findOne({email});
 if(existedUser){
  return next(new ErrorHandler("User with this email already existed", 401));
 }
  const user = await User.create({
    name, email, phone, role, password
  }) as UserDocument; // Type assertion to UserDocument
if(!user){
    return next(new ErrorHandler("Something went wrong while registering user",501))
}
if (typeof user.getJWTToken !== "function") {
  return next(new ErrorHandler("getJWTToken method is not defined", 500));
}
const token = user.getJWTToken();

// Options for cookie
const options = {
  expiresIn: new Date(
    Date.now() + (Number(process.env.COOKIE_EXPIRE_DAYS)) * 24 * 60 * 60 * 1000
  ),
  httpOnly: true,
};
res.status(201).cookie("token", token, options).json({
  success: true,
  message: "User Registered Sucesssfully",
  user,
  token
});
});
export const login = TryCatch(async(req,res,next)=>{
   const {email, password, role} = req.body;
   if(!email || !password || !role){
    return next(new ErrorHandler("All fields are required", 401));
   }
   const user = await User.findOne({email}).select("+password")
   if(!user){
    return next(new ErrorHandler("Invalid Email or Password",401))
}
const isPasswordMatched = await user.comparePassword(password);
if(!isPasswordMatched){
 return next (new ErrorHandler("Invalid Email or Password",401));
}
if(user.role !== role){
   return next (new ErrorHandler("User with this role not found",401));
}
// sendToken(user, 201, res, "User logged in Successfully")
const token = user.getJWTToken();
// Options for cookie
const options = {
  expiresIn: new Date(
    Date.now() + (Number(process.env.COOKIE_EXPIRE_DAYS)) * 24 * 60 * 60 * 1000
  ),
  httpOnly: true,
};
res.status(201).cookie("token", token, options).json({
  success: true,
  message: "User LoggedIn Sucesssfully",
  user,
  token
});
});
export const logout = TryCatch(async(req,res,next)=>{
res
    .status(201)
    .cookie("token", "", {
      httpOnly: true,
      expires: new Date(Date.now()),
    })
    .json({
      success: true,
      message: "Logged Out Successfully.",
    });
});
export const getUser = TryCatch(async(req:AuthenticatedRequest,res,next)=>{
       const user = req.user;
       if(!user){
        return next(new ErrorHandler("User not found",401))
       }
       res.status(201).json({
        message: "User found successfully",
        user
       });
});


