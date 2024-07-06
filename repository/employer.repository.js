import EmployerProfile from "../models/EmployerProfile.js";

export const addEmployerProfile= async(req)=>{
        const data = await EmployerProfile.create(req.body);
        return data;
}


export const findAllEmployers= async()=>{
        return await EmployerProfile.findAll();
}

export const findEmployerById = async(id)=>{
        return await EmployerProfile.findByPk(id);
}