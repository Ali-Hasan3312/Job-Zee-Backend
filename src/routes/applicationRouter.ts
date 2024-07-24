import express from "express";
import { isAuthenticated } from "../middlewares/auth.middleware.js";
import { employerGetAllApplications, jobseekerDeleteApplication, jobseekerGetAllApplications, postApplication } from "../controllers/application.controller.js";
const applicationRouter = express.Router();
applicationRouter.route("/create").post(isAuthenticated,postApplication);
applicationRouter.route("/employerAll").get(isAuthenticated,employerGetAllApplications);
applicationRouter.route("/jobSeekerAll").get(isAuthenticated,jobseekerGetAllApplications);
applicationRouter.route("/:id").delete(isAuthenticated,jobseekerDeleteApplication);
export default applicationRouter;