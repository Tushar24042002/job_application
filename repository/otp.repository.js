import Otp from "../models/Otp.js";

export const addOtp = async (obj) => {
    const data = await Otp.create(obj);
    return data;
  };

  export const getOtpFromEmail = async (email) => {
    const data = await Otp.findOne({
        where: { email },
        order: [['valid_upto', 'DESC']] 
    });
    return data;
};