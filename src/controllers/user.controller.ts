import { NextFunction, Request, Response } from "express";
import { AuthenticatedRequest } from "../middlewares/auth.middleware.js";
import { TryCatch } from "../middlewares/error.middleware.js";
import { User, UserDocument } from "../models/user.model.js";
import ErrorHandler from "../utils/errorHandler.js";

export const registerUser = TryCatch(async (req: Request, res: Response, next: NextFunction) => {
  const { name, email, phone, role,_id } = req.body;
  
  if (!name || !email || !phone || !role ) {
    return next(new ErrorHandler("All fields are required", 401));
  }  
 const existedUser = await User.findOne({email});
 if(existedUser){
  return next(new ErrorHandler("User with this email already existed", 401));
 }
  const user = await User.create({
    name, email, phone, role,_id
  }) as UserDocument; 
if(!user){
    return next(new ErrorHandler("Something went wrong while registering user",501))
}
res.status(201).json({
  success: true,
  message: "User Registered Sucesssfully",
  user
  
});
});
export const login = TryCatch(async(req,res,next)=>{
   const {email, role} = req.body;
   if(!email  || !role){
    return next(new ErrorHandler("All fields are required", 401));
   }
   const user = await User.findOne({email});
   if(!user){
    return next(new ErrorHandler("Invalid Email or Password",401))
}
if(user.role !== role){
   return next (new ErrorHandler("User with this role not found",401));
}
res.status(201).json({
  success: true,
  message: "User LoggedIn Sucesssfully",
  user,
  
});
});
export const logout = TryCatch(async(req,res,next)=>{
res
    .status(201)
    .json({
      success: true,
      message: "Logged Out Successfully.",
    });
});
export const getUser = TryCatch(async(req:AuthenticatedRequest,res,next)=>{
  const {id} = req.params
  const user = await User.findById(id);
       if(!user){
        return next(new ErrorHandler("User not found",401))
       }
       res.status(201).json({
        message: "User found successfully",
        user
       });
});


