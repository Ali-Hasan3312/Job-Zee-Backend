import { NextFunction, Request, Response } from "express";
import ErrorHandler from "../utils/errorHandler.js";
import { ControllerType } from "../types/types.js";
export const errorMiddleware = (
  err: ErrorHandler,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  err.message ||= "Internal Server Error";
  err.statusCode ||= 500;
  // if (err.name === "CastError") err.message = "Invalid ID";
  if(err.name==="CastError"){
    const message = `Resource not found, Invalid ${err.path}`;
    err = new ErrorHandler(message,400)
  }
  if(err.code===11000){
    const message = `Duplicate ${Object.keys(err.keyValue!)} Entered`;
    err = new ErrorHandler(message,400)
  }
   if (err.name === "JsonWebTokenError") {
    const message = `Json Web Token is invalid, Try again!`;
    err = new ErrorHandler(message, 400);
  }
  if (err.name === "TokenExpiredError") {
    const message = `Json Web Token is expired, Try again!`;
    err = new ErrorHandler(message, 400);
  }
  return res.status(err.statusCode).json({
    success: false,
    message: err.message,
  });
};
export const TryCatch =
  (func: ControllerType) =>
  (req: Request, res: Response, next: NextFunction) => {
    return Promise.resolve(func(req, res, next)).catch(next);
  };