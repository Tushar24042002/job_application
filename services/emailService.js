
import EmailTemplate from "../models/EmailTemplate.js";


export const addEmail = async (req, res) => {
    try {
      const {subject, body} = req.body;
        const data = await EmailTemplate.create({ subject, body });
        console.log(data)
        res.status(200).json(data);
    } catch (error) {
        if (error.name === 'SequelizeValidationError') {
           console.log(error);
        } else {
           console.log(error);
        }
    }
}

await addEmail("Complete Your Registration - OTP Verification", `
    <div style="font-family: Arial, sans-serif; line-height: 1.6;">
      <h2>Complete Your Registration</h2>
      <p>Hello, {userName},</p>
      <p>Thank you for registering with our job portal. To complete your registration, please use the following One-Time Password (OTP) to verify your email address:</p>
      <div style="font-size: 24px; font-weight: bold; text-align: center; margin: 20px 0; color: #333333;">{otp}</div>
      <p>This OTP is valid for the next 10 minutes. Please do not share this OTP with anyone.</p>
      <p>If you did not request this email, please ignore it.</p>
      <p>Thank you,<br>Job Portal Team</p>
    </div>
`)


await addEmail("Job Application Status Update",`
    <div style="font-family: Arial, sans-serif; line-height: 1.6;">
      <h2>Job Application Status Update</h2>
      <p>Dear {userName},</p>
      <p>We are writing to inform you that the status of your application for the position of <strong>{jobTitle}</strong> has been updated.</p>
      <p><strong>Status Update:</strong> {statusMessage}</p>
      <p>Thank you for your interest in joining our team. If you have any questions, please feel free to reach out to us.</p>
      <p>Best regards,</p>
      <p>The Hiring Team</p>
    </div>
  `)