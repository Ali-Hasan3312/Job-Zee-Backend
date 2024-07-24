import { v2 as cloudinary } from 'cloudinary';
import { TryCatch } from "../middlewares/error.middleware.js"
import { AuthenticatedRequest } from "../middlewares/auth.middleware.js";
import ErrorHandler from "../utils/errorHandler.js";
import { Job } from '../models/job.model.js';
import { Application } from '../models/application.model.js';

interface UploadedFile {
    mimetype: string;
    // Add other properties you might need
    name: string;
    size: number;
    tempFilePath: string;
    // ...
  }
  cloudinary.config({
    cloud_name: "dv0yscnct",
    api_key: "261695339612612",
    api_secret: "r3c4pLGX_9zOJkeJfru8CaB7ohY",
  });
  
  export const postApplication = TryCatch(async (req: AuthenticatedRequest, res, next) => {
    const role = req.user?.role;
    if (role === "Employer") {
      return next(
        new ErrorHandler("Employer not allowed to access this resource.", 400)
      );
    }
    if (!req.files || Object.keys(req.files).length === 0) {
      return next(new ErrorHandler("Resume File Required!", 400));
    }
    
    const file = req.files.resume as UploadedFile;
    
    type AllowedFormats = {
      [key: string]: "image";
    };
    
    const allowedFormats: AllowedFormats = {
    "image/png": "image",
      "image/jpeg": "image",
      "image/webp": "image",
     
     
    };

    const resourceType = allowedFormats[file.mimetype];
    if (!resourceType) {
      return next(new ErrorHandler("Invalid file type. Please upload a supported file format.", 400));
    }
  
    const cloudinaryResponse = await cloudinary.uploader.upload(
      file.tempFilePath,
      { resource_type: resourceType }
    );
  
    if (!cloudinaryResponse || cloudinaryResponse.error) {
      console.error(
        "Cloudinary Error:",
        cloudinaryResponse.error || "Unknown Cloudinary error"
      );
      return next(new ErrorHandler("Failed to upload file to Cloudinary", 500));
    }
    
    const { name, email, coverLetter, phone, address, jobId } = req.body;
    const applicantID = {
      user: req.user?._id,
      role: "Job Seeker",
    };
    if (!jobId) {
      return next(new ErrorHandler("Job not found!", 404));
    }
    const jobDetails = await Job.findById(jobId);
    if (!jobDetails) {
      return next(new ErrorHandler("Job not found!", 404));
    }
    const employerID = {
      user: jobDetails.postedBy,
      role: "Employer",
    };
    if (
      !name ||
      !email ||
      !coverLetter ||
      !phone ||
      !address ||
      !applicantID ||
      !employerID ||
      !file
    ) {
      return next(new ErrorHandler("Please fill all fields.", 400));
    }
    const application = await Application.create({
      name,
      email,
      coverLetter,
      phone,
      address,
      applicantID,
      employerID,
      resume: {
        public_id: cloudinaryResponse.public_id,
        url: cloudinaryResponse.secure_url,
      },
    });
    res.status(200).json({
      success: true,
      message: "Application Submitted!",
      application,
    });
  });
  
export const employerGetAllApplications = TryCatch(
    async (req:AuthenticatedRequest, res, next) => {
      const role = req.user?.role;
      if (role === "Job Seeker") {
        return next(
          new ErrorHandler("Job Seeker not allowed to access this resource.", 400)
        );
      }
      const  _id  = req.user?._id;
      const applications = await Application.find({ "employerID.user": _id });
      res.status(200).json({
        success: true,
        applications,
      });
    }
  );

  export const jobseekerGetAllApplications = TryCatch(
    async (req:AuthenticatedRequest, res, next) => {
      const  role  = req.user?.role;
      if (role === "Employer") {
        return next(
          new ErrorHandler("Employer not allowed to access this resource.", 400)
        );
      }
      const  _id  = req.user?._id;
      const applications = await Application.find({ "applicantID.user": _id });
      res.status(200).json({
        success: true,
        applications,
      });
    }
  );

  export const jobseekerDeleteApplication = TryCatch(
    async (req:AuthenticatedRequest, res, next) => {
      const role  = req.user?.role;
      if (role === "Employer") {
        return next(
          new ErrorHandler("Employer not allowed to access this resource.", 400)
        );
      }
      const { id } = req.params;
      const application = await Application.findById(id);
      if (!application) {
        return next(new ErrorHandler("Application not found!", 404));
      }
      await application.deleteOne();
      res.status(200).json({
        success: true,
        message: "Application Deleted!",
      });
    }
  );