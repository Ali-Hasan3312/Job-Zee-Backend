import express from "express";
import { isAuthenticated } from "../middlewares/auth.middleware.js";
import { employerGetAllApplications, jobseekerDeleteApplication, jobseekerGetAllApplications, postApplication } from "../controllers/application.controller.js";
const applicationRouter = express.Router();
applicationRouter.route("/create/:id").post(postApplication);
applicationRouter.route("/employerAll/:id").get(employerGetAllApplications);
applicationRouter.route("/jobSeekerAll/:id").get(jobseekerGetAllApplications);
applicationRouter.route("/:id").delete(jobseekerDeleteApplication);
export default applicationRouter;