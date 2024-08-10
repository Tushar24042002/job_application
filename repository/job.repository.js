// jobProfileService.js

import sequelize from "../config.js";
import Job from "../models/Job.js";
import Industry from "../models/Industry.js";
import JobIndustry from "../models/JobIndustry.js";
import EmployerProfile from "../models/EmployerProfile.js";
import { Sequelize } from "sequelize";
import { getCurrentUser } from "../services/user.service.js";
import { findEmployerByuser_id } from "../services/employer.service.js";
import AppliedJob from "../models/AppliedJobs.js";
import { findJobSeekerFromRequest } from "../services/jobSeeker.service.js";
import { JOB_STATUS_IDS } from "../Consts.js";
import JobSeekerProfile from "../models/JobSeeker.js";
import User from "../models/User.js";

export const addJobProfile = async (req, res) => {
  const {
    title,
    description,
    requirements,
    location,
    salary,
    type,
    industryIds,
  } = req.body;

  const transaction = await sequelize.transaction();

  try {
    // Create job profile
    const user = await getCurrentUser(req, res);
    console.log(user)
    const employer = await findEmployerByuser_id(req, res, user.id);
    console.log(employer)
    const employer_id = employer.id;
    const job = await Job.create(
      {
        title,
        description,
        requirements,
        employer_id,
        location,
        salary,
        type,
      },
      { transaction }
    );

    const jobIndustryAssociations = industryIds.map((industry_id) => ({
      job_id: job.id,
      industry_id: industry_id,
    }));
    await JobIndustry.bulkCreate(jobIndustryAssociations, { transaction });
    await transaction.commit();
    return job;
  } catch (error) {
    await transaction.rollback();
    console.error("Error in addJobProfile:", error);

    throw error;
  }
};


export const findAllJobs = async () => {
  return await Job.findAll({
    attributes: {
      exclude: ['employerId'] // Exclude employerId from the result
    },
    include: [
      {
        model: EmployerProfile,
        as: 'employer',
        id: Sequelize.col("Job.employerId"),
        attributes: ['id', 'company_name'],
      },
    ],
  });
};

export const findJobById = async (id) => {
  return await Job.findByPk(id, {
    attributes: {
      exclude: ['employerId'] // Exclude employerId from the result
    },
    include: [
      {
        model: EmployerProfile,
        as: 'employer',
        id: Sequelize.col("Job.employerId"),
        attributes: ['id', 'company_name'],
      },
    ],
  })
};

export const jobApply = async (job_id, job_seeker_id) => {
  const status = JOB_STATUS_IDS.SUBMITTED;
  const data = await AppliedJob.create({ job_id, job_seeker_id, status });
  return data;
}


export const getAllJobSeekerAppliedJobs = async (req, res) => {
  const jobSeeker = await findJobSeekerFromRequest(req, res);
  const job_seeker_id = jobSeeker.id;
  return await AppliedJob.findAll({
    where: { job_seeker_id },
    attributes: {
      exclude: ['job_seeker_id', 'job_id']
    },
    include: [
      {
        model: Job,
        as: 'job',
        id: Sequelize.col("AppliedJob.job_id"),
        attributes: ['id', 'title', 'location'],
        include: [
          {
            model: EmployerProfile,
            as: 'employer',
            user_id: Sequelize.col("Job.employerId"),
            attributes: ['id', 'company_name'],
          }],
      },
    ],
  });
};


// export const updateUserAppliedJobStatus = async (id, status) => {
//   const data = await AppliedJob.update(
//     { status: status },
//     { where: { id } }
//   )
//   const userData = await AppliedJob.findOne({ where: { id }, 
//     attributes: {
//       exclude: ['job_seeker_id', 'job_id']
//     },
//     include: [
//       {
//         model: Job,
//         as: 'job',
//         id: Sequelize.col("AppliedJob.job_id"),
//         attributes: ['id', 'title'],
//       },
//       {
//         model: JobSeekerProfile,
//         as: 'jobSeeker',
//         id: Sequelize.col("AppliedJob.job_seeker_id"),
//         attributes: ['id'], 
//         include: [
//           {
//             model: User,
//             as: 'user',
//             id: Sequelize.col("jobSeeker.user_id"),
//             attributes: ['id','name', 'email'],
//           }],
//       },
//     ] });
//   return userData;
// }


export const updateUserAppliedJobStatus = async (id, status) => {
  try {
    // SQL query to update the status of the applied job
    const updateQuery = `
      UPDATE applied_jobs
      SET status = :status
      WHERE id = :id;
    `;

    // Execute the update query
    await sequelize.query(updateQuery, {
      replacements: { id, status },
      type: sequelize.QueryTypes.UPDATE,
      logging: console.log,
    });

    // SQL query to fetch the updated job application details along with job seeker and user details
    const selectQuery = `
      SELECT 
        aj.id AS "appliedJobId",
        aj.status,
        j.id AS "jobId",
        j.title AS "jobTitle",
        jsp.id AS "jobSeekerId",
        u.id AS "userId",
        u.name AS "userName",
        u.email AS "userEmail"
      FROM 
        applied_jobs aj
      JOIN 
        job j ON aj.job_id = j.id
      JOIN 
        job_seeker_profile jsp ON aj.job_seeker_id = jsp.id
      JOIN 
        users u ON jsp.user_id = u.id
      WHERE 
        aj.id = :id;
    `;

    // Execute the select query
    const [userData] = await sequelize.query(selectQuery, {
      replacements: { id },
      type: sequelize.QueryTypes.SELECT,
      logging: console.log,
    });

    return userData;
  } catch (error) {
    console.error('Error updating and fetching user applied job status:', error);
    throw error;
  }
};
