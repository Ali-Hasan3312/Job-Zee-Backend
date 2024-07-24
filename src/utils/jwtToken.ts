import { Response } from "express";
import { UserDocument } from "../models/user.model.js"; // Adjust the import path

export const sendToken = (user: UserDocument, statusCode: number, res: Response, message: string) => {
  const token = user.getJWTToken();
  // Options for cookie
  const options = {
    expiresIn: new Date(
      Date.now() + (Number(process.env.COOKIE_EXPIRE_DAYS)) * 24 * 60 * 60 * 1000
    ),
    httpOnly: true,
  };

  res.status(statusCode).cookie("token", token, options).json({
    success: true,
    message,
    user,
  });
};
