import express from "express";
import { addEmpProfile, getAllEmployers, getEmployerById, getEmployerDashboard } from "../services/employer.service.js";
import { USER_ADMIN, USER_EMPLOYER, USER_JOB_SEEKER } from "../Consts.js";
import { isValidUser } from "../middleware/middleware.js";
const router = express.Router();


// Route to create a new user
router.post("/add", isValidUser([USER_ADMIN, USER_EMPLOYER]), (req, res) => {
    addEmpProfile(req, res);
  });

  router.get("/employer-jobs", isValidUser([USER_ADMIN, USER_EMPLOYER]), (req, res) => {
    getEmployerDashboard(req, res);
  });

router.get("/", isValidUser([USER_ADMIN]), (req, res) => {
    getAllEmployers(req, res);
  });
router.get("/:id",  isValidUser([USER_ADMIN, USER_EMPLOYER, USER_JOB_SEEKER]), (req, res) => {
    getEmployerById(req, res);
  });

export default router;
