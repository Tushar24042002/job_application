import express from "express";
import { addEmpProfile, getAllEmployers, getEmployerById } from "../services/employer.service.js";
const router = express.Router();


// Route to create a new user
router.post('/create', addEmpProfile);
router.get("/", getAllEmployers);
router.get("/:id", getEmployerById);

export default router;
