import CustomValidationError from "../Exceptions/CustomException.js";
import { addJobSeekerProfile, findAllJobSeekers, findJobSeekerById, findJobSeekerByuser_id } from "../repository/jobSeeker.repository.js";
import { getCurrentUser } from "./user.service.js";

export const addJobSeeker = (req, res, next) => {
  addJobSeekerProfile(req, res)
    .then((data) => {
      res.status(201).json(data);
    })
    .catch((error) => {
      if (error.name === 'SequelizeValidationError') {
        throw new CustomValidationError([{ message: 'Add Job Seeker' }]);
      } else {
        throw new CustomValidationError([{ message: 'Add Job Seeker' }]);
      }
    });
};

export const getAllJobSeekers = async (req, res) => {
  try {
    const allUsers = await findAllJobSeekers();
    res.status(200).json(allUsers);
  } catch (error) {
    res.status(500).json([{ message: 'Employer profile not found' }]);
  }
}


export const getJobSeekerById = async (req, res) => {
  const empid = req.params.id;
  try {
    const job_seeker = await findJobSeekerById(empid);
    if (!job_seeker) {
      res.status(404).json([{ message: 'Job Seeker not found' }]);
    }
    res.status(200).json(job_seeker);
  } catch (error) {
    res.status(500).json([{ message: 'Job Seeker not found' }]);
  }
}

export const findJobSeekerFromRequest = async (req, res) => {
  try {
    const user = await getCurrentUser(req, res);
    const jobSeeker = await findJobSeekerByuser_id(user.id);
    if(jobSeeker === null){
      res.status(404).json({ success : false, message: 'User Profile not found, Please Add' });
    }
    return jobSeeker;
  } catch (error) {
    res.status(500).json({ message: 'Job Seeker not found' });
  }
}
