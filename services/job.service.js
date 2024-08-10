import { JOB_STATUS_IDS } from "../Consts.js";
import CustomValidationError from "../Exceptions/CustomException.js";
import { addJobProfile, findAllJobs, findJobById, getAllJobSeekerAppliedJobs, jobApply, updateUserAppliedJobStatus } from "../repository/job.repository.js";
import { sendEmail } from "../utils/email.js";
import { findJobSeekerFromRequest } from "./jobSeeker.service.js";
import { getCurrentUser } from "./user.service.js";

export const addJob = async (req, res, next) => {
    try {
        const newUser = await addJobProfile(req, res);
        res.status(201).json(newUser);
    } catch (error) {
        if (error.name === 'SequelizeValidationError') {
            throw new CustomValidationError(error.errors);
        } else {
            throw new CustomValidationError(error.errors);
        }
    }
}

export const getAllJobs = async (req, res) => {
    try {
        const allUsers = await findAllJobs();
        res.status(200).json(allUsers);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}


export const findAllJobSeekerAppliedJobs = async (req, res) => {
    console.log("calling this one")
    try {
        const appliedJob = await getAllJobSeekerAppliedJobs(req, res);
        res.status(200).json(appliedJob);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}


export const getJobById = async (req, res) => {
    const jobId = req.params.id;
    try {
        const job = await findJobById(jobId);
        if (!job) {
            throw new CustomValidationError([{ message: 'Job not found' }]);
        }
        res.status(200).json(job);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

export const applyJob = async (req, res) => {
    const { jobId } = req.params;
    try {
        const jobSeeker = await findJobSeekerFromRequest(req, res);
        const data = await jobApply(jobId, jobSeeker.id);
        const job = await findJobById(jobId);
        const user = await getCurrentUser(req,res);
        const emailTemplate =await jobApplicationStatusEmailTemplate(user?.email, job?.title, JOB_STATUS_IDS.SUBMITTED);
        sendEmail(user?.email,"Job Status", emailTemplate);
        res.status(200).json({ success: true, data: data });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}



export const updateAppliedJobStatus = async (req, res) => {
    const { appliedJobId } = req.params;
    const { status } = req.body;
    try {
        const data = await updateUserAppliedJobStatus(appliedJobId, status);
        const emailTemplate =await jobApplicationStatusEmailTemplate(data?.userEmail, data?.jobTitle, status);
        sendEmail(data?.userEmail,"Job Status", emailTemplate);
        res.status(200).json({ success: true, message: "Job Status updated successfully", data : data });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}


export const jobApplicationStatusEmailTemplate =async (userName, jobTitle, jobStatusId) => {
    let statusMessage;

    switch (Number(jobStatusId)) {
        case JOB_STATUS_IDS.PENDING:
            statusMessage = 'Your application is currently pending review.';
            break;
        case JOB_STATUS_IDS.SUBMITTED:
            statusMessage = 'Your application has been submitted successfully.';
            break;
        case JOB_STATUS_IDS.REVIEWED:
            statusMessage = 'Your application has been reviewed by our team.';
            break;
        case JOB_STATUS_IDS.INTERVIEW_SCHEDULED:
            statusMessage = 'Your interview has been scheduled.';
            break;
        case JOB_STATUS_IDS.INTERVIEWED:
            statusMessage = 'You have completed the interview.';
            break;
        case JOB_STATUS_IDS.OFFERED:
            statusMessage = 'Congratulations! You have been offered the position.';
            break;
        case JOB_STATUS_IDS.ACCEPTED:
            statusMessage = 'Thank you for accepting the job offer. We are excited to have you on board!';
            break;
        case JOB_STATUS_IDS.REJECTED:
            statusMessage = 'We regret to inform you that your application has been rejected.';
            break;
        case JOB_STATUS_IDS.WITHDRAWN:
            statusMessage = 'You have withdrawn your application.';
            break;
        default:
            statusMessage = 'There has been an update to your application status.';
    }

    return `
      <div style="font-family: Arial, sans-serif; line-height: 1.6;">
        <h2>Job Application Status Update</h2>
        <p>Dear ${userName},</p>
        <p>We are writing to inform you that the status of your application for the position of <strong>${jobTitle}</strong> has been updated.</p>
        <p><strong>Status Update:</strong> ${statusMessage}</p>
        <p>Thank you for your interest in joining our team. If you have any questions, please feel free to reach out to us.</p>
        <p>Best regards,</p>
        <p>The Hiring Team</p>
      </div>
    `;
};
