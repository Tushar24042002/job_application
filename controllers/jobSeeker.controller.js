import express from 'express';
import { addJobSeeker, getAllJobSeekers, getJobSeekerById } from '../services/jobSeeker.service.js';
import { USER_ADMIN, USER_EMPLOYER, USER_JOB_SEEKER } from '../Consts.js';
import { isValidUser } from '../middleware/middleware.js';
const router = express.Router();

router.post("/add-profile", isValidUser([USER_JOB_SEEKER]), (req, res) => {
  addJobSeeker(req, res);
});

// router.get("/", getAllJobSeekers);
router.get("/", isValidUser([USER_ADMIN]), (req, res) => {
  getgetAllJobSeekersobSeekerById(req, res);
});

router.get("/:id", isValidUser([USER_ADMIN, USER_EMPLOYER]), (req, res) => {
  getJobSeekerById(req, res);
});
export default router;
