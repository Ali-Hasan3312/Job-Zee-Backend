import { Document, Model, Schema, model } from "mongoose";
import validator from "validator";
import bcrypt from "bcrypt";
import jwt from 'jsonwebtoken';

 interface UserDocument extends Document {
  name: string;
  email: string;
  phone: number;
  password: string;
  role: "Job Seeker" | "Employer";
  createdAt: Date;
  updatedAt: Date;
  comparePassword(enteredPassword: string): Promise<boolean>;
  getJWTToken(): string;
}

interface UserModel extends Model<UserDocument> {}

const userSchema = new Schema<UserDocument>({
  name: {
    type: String,
    required: [true, "Please provide your name!"],
    minLength: [3, "Name must contain at least 3 characters!"],
    maxLength: [30, "Name cannot exceed 30 characters!"],
  },
  email: {
    type: String,
    required: [true, "Please provide a valid email"],
    validate: [validator.isEmail, "Please provide a valid email!"]
  },
  phone: {
    type: Number,
    required: [true, "Please provide phone number"]
  },
  password: {
    type: String,
    required: [true, "Please provide your password!"],
    minLength: [8, "Password must contain at least 8 characters!"],
    maxLength: [32, "Password cannot exceed 32 characters!"],
    select: false
  },
  role: {
    type: String,
    required: [true, "Please provide your role"],
    enum: ["Job Seeker", "Employer"]
  },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

// Hashing the password
userSchema.pre<UserDocument>("save", async function (next) {
  const user = this as UserDocument;
  if (!user.isModified("password")) {
    return next();
  }
 
    user.password = await bcrypt.hash(user.password, 10);
    return next();
 
});

// Comparing the password
userSchema.methods.comparePassword = async function (enteredPassword: string): Promise<boolean> {
  const user = this as UserDocument;
  return await bcrypt.compare(enteredPassword, user.password);
};
// Generating a JWT token when a user registers or logs in
userSchema.methods.getJWTToken = function (): string {
  const jwtSecret = process.env.JWT_SECRET_KEY || '';
  const user = this as UserDocument;
  if (!jwtSecret) {
    throw new Error("JWT_SECRET_KEY must be defined");
  }
  return jwt.sign({ id: user._id }, jwtSecret, {
    expiresIn: process.env.JWT_EXPIRE,
  });
};

const User = model<UserDocument, UserModel>("User", userSchema);

export { User, UserDocument };
