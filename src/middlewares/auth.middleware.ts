import { User, UserDocument } from "../models/user.model.js";
import { Request, Response, NextFunction } from "express";
import ErrorHandler from "../utils/errorHandler.js";
import jwt from "jsonwebtoken";
import { TryCatch } from "./error.middleware.js";
export interface AuthenticatedRequest extends Request {
    user?: UserDocument | null;
  } 
export const isAuthenticated = TryCatch(async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  const { token } = req.cookies;
  if (!token) {
    return next(new ErrorHandler("Please login to access this resource", 401));
  }
  const decodedToken = jwt.verify(token, process.env.JWT_SECRET_KEY!) as { id: string};
   req.user = await User.findById(decodedToken.id);
   next();
});
