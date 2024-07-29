import express from "express";
import { deleteJob, getAllJobs, getMyJob, getSingleJob, postJob, updateJob } from "../controllers/job.controller.js";
import { isAuthenticated } from "../middlewares/auth.middleware.js";
const jobRouter = express.Router();
jobRouter.route("/getAll").get(getAllJobs);
jobRouter.route("/post/:id").post(postJob);
jobRouter.route("/myJobs/:id").get(getMyJob);
jobRouter.route("/:id").put(updateJob)
.get(getSingleJob)
.delete(deleteJob);
export default jobRouter;