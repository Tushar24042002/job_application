import CustomValidationError from "../Exceptions/CustomException.js";
import { addJobSeekerProfile, findAllJobSeekers, findJobSeekerById } from "../repository/jobSeeker.repository.js";

export const addJobSeeker = (req, res, next) => {
    addJobSeekerProfile(req, res)
      .then((data) => {
        console.log(data, "data service");
        res.status(201).json(data);
      })
      .catch((error) => {
        if (error.name === 'SequelizeValidationError') {
          next(new CustomValidationError(error.errors));
        } else {
          next(error);
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


export const getJobSeekerById= async(req, res)=>{
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