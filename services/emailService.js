import CustomValidationError from "../Exceptions/CustomException.js";
import EmailTemplate from "../models/EmailTemplate.js";

export const addEmail = async (subject, body) => {
    try {
        const data = await EmailTemplate.create({ subject, body });
        console.log(data)
    } catch (error) {
        if (error.name === 'SequelizeValidationError') {
           console.log(error);
        } else {
           console.log(error);
        }
    }
}
