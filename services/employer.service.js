import CustomValidationError from "../Exceptions/CustomException.js";
import EmployerProfile from "../models/EmployerProfile.js";
import { addEmployerProfile, findAllEmployers, findEmployerById, getEmployerJobs } from "../repository/employer.repository.js";
import { getCurrentUser } from "./user.service.js";

export const addEmpProfile = async (req, res, next) => {
    try {
        const newUser = await addEmployerProfile(req,res);
        res.status(201).json(newUser);
    } catch (error) {
        if (error.name === 'SequelizeValidationError') {
            throw new CustomValidationError(error.errors);
        } else {
            throw new CustomValidationError(error.errors);
        }
    }
}

export const getAllEmployers = async (req, res) => {
    try {
        const allUsers = await findAllEmployers();
        res.status(200).json(allUsers);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}


export const getEmployerById= async(req, res)=>{
    const empid = req.params.id;
    try {
        const employer = await findEmployerById(empid);
        if (!employer) {
            throw new CustomValidationError([{ message: 'Employer profile not found' }]);
        }
        res.status(200).json(employer);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}


export const applyJob=async(req,res)=>{
    const { jobId } = req.params;
    try {
        const jobSeeker = await findJobSeekerByUser(req,res);
        console.log(jobSeeker,"js");
        const data = await jobApply(jobId, jobSeeker.id);
        console.log(data, "dagta")
        res.status(200).json(data);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}



export const getEmployerDashboard = async (req, res) => {
    const page = parseInt(req.query.page) || 1;
  const pageSize = parseInt(req.query.pageSize) || 10;
    try {
        const user = await getCurrentUser(req, res);
        const employer = await findEmployerByUserId(req, res, user.id);
        const dashboardData = await getEmployerJobs(employer.id, Number(page) || 1, Number(pageSize));
        if (!dashboardData) {
            throw new CustomValidationError([{ message: 'Employer not found' }]);
        }
        res.status(200).json(dashboardData);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}


export const findEmployerByUserId = async (req,res, userId) => {
    try {
        const employer = EmployerProfile.findOne({ where: { userId } });
        if (!employer) {
            throw new CustomValidationError([{ message: 'Employer not found' }]);
        }
        return employer;
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}