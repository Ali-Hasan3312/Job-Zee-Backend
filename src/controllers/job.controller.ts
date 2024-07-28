import { log } from "console";
import { AuthenticatedRequest } from "../middlewares/auth.middleware.js";
import { TryCatch } from "../middlewares/error.middleware.js";
import { Job } from "../models/job.model.js";
import ErrorHandler from "../utils/errorHandler.js";
import { User } from "../models/user.model.js";


export const getAllJobs = TryCatch(async (req, res, next) => {
    const jobs = await Job.find({ expired: false });
    res.status(200).json({
      success: true,
      jobs,
    });

  });
export const postJob = TryCatch(async(req:AuthenticatedRequest,res,next)=>{
  const userId = req.params.id
  const user = await User.findById(userId)
  const role = user?.role;
    if(role === "Job Seeker"){
        return next(
            new ErrorHandler("Job Seeker not allowed to access this resource.", 400)
          );
    }
    const {
        title,
        description,
        category,
        country,
        city,
        location,
        fixedSalary,
        salaryFrom,
        salaryTo,
      } = req.body;

      if (!title || !description || !category || !country || !city || !location) {
        return next(new ErrorHandler("All field are required", 400));
      }
      if ((!salaryFrom || !salaryTo) && !fixedSalary) {
        return next(
          new ErrorHandler(
            "Please either provide fixed salary or ranged salary.",
            400
          )
        );
      }
      if (salaryFrom && salaryTo && fixedSalary) {
        return next(
          new ErrorHandler("Cannot Enter Fixed and Ranged Salary together.", 400)
        );
      }

      const postedBy = user?._id;  
  const job = await Job.create({
    title,
    description,
    category,
    country,
    city,
    location,
    fixedSalary,
    salaryFrom,
    salaryTo,
    postedBy,
  });
  res.status(200).json({
    success: true,
    message: "Job Posted Successfully!",
    job,
  });
    
});
export const getMyJob = TryCatch(async(req:AuthenticatedRequest,res,next)=>{
  const userId = req.params.id
  const user = await User.findById(userId)
  const role = user?.role;
  if(role === "Job Seeker"){
    return next(
      new ErrorHandler("Job Seeker not allowed to access this resource.", 400)
    );
  }
  
  const myJobs = await Job.find({postedBy: user?._id});
 return res.status(201).json({
    success: true,
    myJobs,
  })
});

export const updateJob = TryCatch(async(req:AuthenticatedRequest,res,next)=>{
 
  const { id } = req.params;
  let job = await Job.findById(id);
  if (!job) {
    return next(new ErrorHandler("OOPS! Job not found.", 404));
  }
  job = await Job.findByIdAndUpdate(id, req.body, {
    new: true,
    runValidators: true,
    useFindAndModify: false,
  });
  res.status(200).json({
    success: true,
    message: "Job Updated!",
  });
});
export const deleteJob = TryCatch(async (req:AuthenticatedRequest, res, next) => {
 
  const { id } = req.params;
  const job = await Job.findById(id);
  if (!job) {
    return next(new ErrorHandler("OOPS! Job not found.", 404));
  }
  await job.deleteOne();
  res.status(200).json({
    success: true,
    message: "Job Deleted!",
  });
});

export const getSingleJob = TryCatch(async (req, res, next) => {
  const { id } = req.params;
  try {
    const job = await Job.findById(id);
    if (!job) {
      return next(new ErrorHandler("Job not found.", 404));
    }
    res.status(200).json({
      success: true,
      job,
    });
  } catch (error) {
    return next(new ErrorHandler(`Invalid ID / CastError`, 404));
  }
});