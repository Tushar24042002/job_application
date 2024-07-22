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