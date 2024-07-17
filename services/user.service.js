// user.service.js
import { findAllUsers, findUserByEmail, saveUser } from "../repository/user.repository.js";
import bcrypt from "bcrypt";
import jwt from 'jsonwebtoken';
import User from "../models/User.js";
import EmailTemplate from "../models/EmailTemplate.js";
import { sendEmail } from "../utils/email.js";
import { EMAIL_TEMPLATE_IDS } from "../Consts.js";
import { insertOtp } from "./otp.service.js";
import { getOtpFromEmail } from "../repository/otp.repository.js";
import { customDate } from "../utils/util.js";

// Function to handle user creation
export const createUser = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;
    const newUser = await saveUser({ name, email, password, role });
    await sendRegisterationOtp({ name, email });
    res.status(201).json(newUser);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

// Function to handle fetching all users
export const getAllUsers = async (req, res) => {
  try {
    const allUsers = await findAllUsers();
    res.status(200).json(allUsers);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

export const generateToken = async (req, res) => {
  let jwtSecretKey = process.env.JWT_SECRET_KEY;
  let data = {
    time: Date(),
    userId: 12,
  }
  const token = jwt.sign(data, jwtSecretKey);
  res.send(token);
}

export const validateToken = async (req, res) => {
  const authHeader = req.headers['authorization'];
  console.log(req.headers)
  const token = authHeader && authHeader.split(' ')[1];
  if (!token) {
    return res.status(401).send({ success: false, message: "Invalid Token" });
  }
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
    const userId = decoded.id;
    const user = await User.findByPk(userId);

    if (user) {
      return res.status(200).send({ success: true, data: { role: user?.role }, message: "Successfully Verified" });
    } else {
      // Access Denied
      return res.status(401).send({ success: false, data: { role: 'UNKNOWN' }, message: error });
    }
  } catch (error) {
    // Access Denied
    return res.status(401).send(error);
  }
}

export const login = async (req, res) => {
  try {
    const user = await findUserByEmail(req);
    if (!user) {
      return res.status(400).send("user not found");
    } else if (await bcrypt.compare(req.body.password, user.password)) {
      if(!user.isverified){
        res.status(403).json({
          status: false,
          message:"User is not Verified",
        });
      }
      const tokenPayload = {
        id: user.id,
      };
      const accessToken = jwt.sign(tokenPayload, process.env.JWT_SECRET_KEY);
      res.status(201).json({
        status: true,
        message: 'User Logged In!',
        data: {
          accessToken,
        },
      });
    } else {
      const err = new Error('Wrong Password!');
      err.status = 400;
      throw err;
    }
  } catch (err) {
    res.status(401).json({
      status: 'fail',
      message: err.message,
    });
  }
};

export const getCurrentUser = async (req, res) => {
  const authHeader = req.headers['authorization'];
  console.log(req.headers)
  const token = authHeader && authHeader.split(' ')[1];
  if (!token) {
    throw new Error('Unauthorized - JWT must be provided');
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
    const userId = decoded.id;
    const user = await User.findByPk(userId);
    if (!user) {
      throw new Error('User not found');
    }
    return user;
  } catch (error) {
    return res.status(500).send(error);
    // throw new Error('Invalid JWT' , error);
  }
};



const sendEmailTemplate = async (id) => {
  return await EmailTemplate.findByPk(id);
}
function replacePlaceholders(template, data) {
  return template.replace(/{(\w+)}/g, (_, key) => data[key] || '');
}



const sendRegisterationOtp = async ({ name, email }) => {
  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  const currentYear = new Date().getFullYear();

  const emailData = {
    userName: name,
    otp: otp,
    currentYear: currentYear
  };
  const templateId = EMAIL_TEMPLATE_IDS.OTP_REGISTRATION;
  const emailTemplate = await sendEmailTemplate(templateId);
  const subject = await replacePlaceholders(emailTemplate.subject, emailData);
  const body = await replacePlaceholders(emailTemplate.body, emailData);

  const currentDate = new Date();
  const validUpto = await customDate(new Date(currentDate.getTime() + 10 * 60000));

  const obj = {
    email: email,
    otp: otp,
    validUpto: validUpto
  }
  await insertOtp(obj)
  await sendEmail(email, subject, body);
}



export const verifyOTP = async (req, res) => {
  try {
    const { otp, email } = req.body;
    const otpData = await getOtpFromEmail(email);
    if (otpData == null || otpData == undefined) {

    }
    if (otpData.otp === otp) {
      const currentDate = await customDate(new Date());
      const validUpto = await customDate(otpData.validUpto);
      console.log(currentDate, validUpto, currentDate <= validUpto)
      if (currentDate.isBefore(validUpto)) {
     await   User.update(
          { isverified: true },
          { where: {email} }
        )
        return res.status(200).send({ success: true, data: otpData, message: "Successfully Verified" });
      }
      return res.status(400).send({ success: false, data: otpData, message: "OTP TimeOut" });
    }
    console.log(otpData);
    return res.status(400).send({ success: false, data: otpData, message: "Invalid OTP" });

  } catch (error) {
    return res.status(500).send({ success: false, message: "error" });
  }
}
