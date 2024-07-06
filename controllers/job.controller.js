import express from "express";
import { addJob, getAllJobs, getJobById } from "../services/job.service.js";
const router = express.Router();


// Route to create a new user
router.post('/add', addJob);
router.get("/", getAllJobs);
router.get("/:id", getJobById);

export default router;
