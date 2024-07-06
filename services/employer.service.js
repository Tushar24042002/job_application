import CustomValidationError from "../Exceptions/CustomException.js";
import { addEmployerProfile, findAllEmployers, findEmployerById } from "../repository/employer.repository.js";

export const addEmpProfile = async (req, res, next) => {
    try {
        const newUser = await addEmployerProfile(req);
        res.status(201).json(newUser);
    } catch (error) {
        if (error.name === 'SequelizeValidationError') {
            next(new CustomValidationError(error.errors));
        } else {
            next(error);
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