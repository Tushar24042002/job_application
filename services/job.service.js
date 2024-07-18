import CustomValidationError from "../Exceptions/CustomException.js";
import { addJobProfile, findAllJobs, findJobById, getAllJobSeekerAppliedJobs, jobApply, updateUserAppliedJobStatus } from "../repository/job.repository.js";
import { findJobSeekerFromRequest } from "./jobSeeker.service.js";

export const addJob = async (req, res, next) => {
    try {
        const newUser = await addJobProfile(req,res);
        res.status(201).json(newUser);
    } catch (error) {
        if (error.name === 'SequelizeValidationError') {
            throw new CustomValidationError(error.errors);
        } else {
            throw new CustomValidationError(error.errors);
        }
    }
}

export const getAllJobs = async (req, res) => {
    try {
        const allUsers = await findAllJobs();
        res.status(200).json(allUsers);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}


export const findAllJobSeekerAppliedJobs = async (req, res) => {
    console.log("calling this one")
    try {
        const appliedJob = await getAllJobSeekerAppliedJobs(req,res);
        res.status(200).json(appliedJob);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}


export const getJobById= async(req, res)=>{
    console.log("calling another")
    const jobId = req.params.id;
    try {
        const job = await findJobById(jobId);
        if (!job) {
            throw new CustomValidationError([{ message: 'Job not found' }]);
        }
        res.status(200).json(job);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

export const applyJob=async(req,res)=>{
    const { jobId } = req.params;
    try {
        const jobSeeker = await findJobSeekerFromRequest(req,res);
        const data = await jobApply(jobId, jobSeeker.id);
        res.status(200).json(data);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}



export const updateAppliedJobStatus=async(req,res)=>{
    const { appliedJobId } = req.params;
    const {status} = req.body;
    try {
     const data =  await updateUserAppliedJobStatus(appliedJobId, status);
       res.status(200).json(data);
    } catch (error) {
        
    }
}
