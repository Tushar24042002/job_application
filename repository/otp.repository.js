import Otp from "../models/Otp.js";

export const addOtp = async (obj) => {
    const data = await Otp.create(obj);
    return data;
  };