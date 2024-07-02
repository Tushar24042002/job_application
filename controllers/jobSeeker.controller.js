import express  from 'express';
import { addJobSeeker, getAllJobSeekers, getJobSeekerById }  from '../services/jobSeeker.service.js';
const router = express.Router();
router.post('/create', addJobSeeker);
router.get("/", getAllJobSeekers);
router.get("/:id", getJobSeekerById);
export default router;
