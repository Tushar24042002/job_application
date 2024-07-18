import express from "express";
import { addJob, applyJob, findAllJobSeekerAppliedJobs, getAllJobs, getJobById, updateAppliedJobStatus } from "../services/job.service.js";
import { isValidUser } from "../middleware/middleware.js";
import { USER_ADMIN, USER_EMPLOYER, USER_JOB_SEEKER } from "../Consts.js";
const router = express.Router();


// Route to create a new user
router.post("/add", isValidUser([USER_ADMIN, USER_EMPLOYER]), (req, res) => {
  addJob(req, res);
});

router.post("/update-job-status/:appliedJobId", isValidUser([USER_ADMIN, USER_EMPLOYER]), (req, res) => {
  updateAppliedJobStatus(req, res);
});

router.post("/apply-job/:jobId", isValidUser([USER_JOB_SEEKER]), (req, res) => {
  applyJob(req, res);
})


router.get("/applied-jobs", isValidUser([USER_JOB_SEEKER]), (req, res) => {
  findAllJobSeekerAppliedJobs(req, res);
})

router.get("/", getAllJobs);
router.get("/:id", (req, res) => {
  getJobById(req, res);
});




export default router;
