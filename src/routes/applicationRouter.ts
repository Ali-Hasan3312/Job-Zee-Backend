import express from "express";
import { isAuthenticated } from "../middlewares/auth.middleware.js";
import { employerGetAllApplications, jobseekerDeleteApplication, jobseekerGetAllApplications, postApplication } from "../controllers/application.controller.js";
const applicationRouter = express.Router();
applicationRouter.route("/create/:id").post(isAuthenticated,postApplication);
applicationRouter.route("/employerAll/:id").get(isAuthenticated,employerGetAllApplications);
applicationRouter.route("/jobSeekerAll/:id").get(isAuthenticated,jobseekerGetAllApplications);
applicationRouter.route("/:id").delete(isAuthenticated,jobseekerDeleteApplication);
export default applicationRouter;