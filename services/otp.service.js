import CustomValidationError from "../Exceptions/CustomException.js";
import { addOtp } from "../repository/otp.repository.js";

export const insertOtp = async (obj) => {
    try {
        const newUser = await addOtp(obj);
        return;
    } catch (error) {
        if (error.name === 'SequelizeValidationError') {
            throw new CustomValidationError(error.errors);
        } else {
            throw new CustomValidationError("OTP insertion error");
        }
    }
}