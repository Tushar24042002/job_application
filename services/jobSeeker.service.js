import CustomValidationError from "../Exceptions/CustomException.js";
import { addJobSeekerProfile, findAllJobSeekers, findAllMyJobsByJobSeekerId, findJobSeekerById, findJobSeekerByUserId } from "../repository/jobSeeker.repository.js";
import { getCurrentUser } from "./user.service.js";

export const addJobSeeker = (req, res, next) => {
  addJobSeekerProfile(req, res)
    .then((data) => {
      res.status(201).json(data);
    })
    .catch((error) => {
      if (error.name === 'SequelizeValidationError') {
        throw new CustomValidationError(error.errors);
      } else {
        throw error;
      }
    });
};

export const getAllJobSeekers = async (req, res) => {
  try {
    const allUsers = await findAllJobSeekers();
    res.status(200).json(allUsers);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}


export const getJobSeekerById = async (req, res) => {
  const empid = req.params.id;
  try {
    const employer = await findJobSeekerById(empid);
    if (!employer) {
      throw new CustomValidationError([{ message: 'Employer profile not found' }]);
    }
    res.status(200).json(employer);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}


export const findAllMyJobs = async (req, res) => {
  try {
    const user = await getCurrentUser(req, res);
    const jobSeeker = await findJobSeekerByUserId(user.id);

    const data = await findAllMyJobsByJobSeekerId(jobSeeker.id);
    res.status(200).json(data);
  } catch (error) {

  }
}