import express from "express";
import { deleteJob, getAllJobs, getMyJob, getSingleJob, postJob, updateJob } from "../controllers/job.controller.js";
import { isAuthenticated } from "../middlewares/auth.middleware.js";
const jobRouter = express.Router();
jobRouter.route("/getAll").get(isAuthenticated,getAllJobs);
jobRouter.route("/post/:id").post(isAuthenticated,postJob);
jobRouter.route("/myJobs/:id").get(isAuthenticated,getMyJob);
jobRouter.route("/:id").put(isAuthenticated,updateJob)
.get(isAuthenticated,getSingleJob)
.delete(isAuthenticated,deleteJob);
export default jobRouter;