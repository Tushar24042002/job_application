import CustomValidationError from "../Exceptions/CustomException.js";
import { addJobProfile, findAllJobs, findJobById } from "../repository/job.repository.js";

export const addJob = async (req, res, next) => {
    try {
        const newUser = await addJobProfile(req);
        res.status(201).json(newUser);
    } catch (error) {
        if (error.name === 'SequelizeValidationError') {
            next(new CustomValidationError(error.errors));
        } else {
            next(error);
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


export const getJobById= async(req, res)=>{
    const empid = req.params.id;
    try {
        const employer = await findJobById(empid);
        if (!employer) {
            throw new CustomValidationError([{ message: 'Employer profile not found' }]);
        }
        res.status(200).json(employer);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

