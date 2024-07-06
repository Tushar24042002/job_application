// jobProfileService.js

import sequelize from "../config.js";
import Job from "../models/Job.js";
import Industry from "../models/Industry.js";
import JobIndustry from "../models/JobIndustry.js";
import EmployerProfile from "../models/EmployerProfile.js";
import { Sequelize } from "sequelize";
import { getCurrentUser } from "../services/user.service.js";
import { findEmployerByUserId } from "../services/employer.service.js";

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
    const employer = await findEmployerByUserId(req, res, user.id);
    console.log(employer)
    const employerId = employer.id;
    const job = await Job.create(
      {
        title,
        description,
        requirements,
        employerId,
        location,
        salary,
        type,
      },
      { transaction }
    );

    const jobIndustryAssociations = industryIds.map((industryId) => ({
      jobId: job.id,
      IndustryId: industryId,
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
        attributes: ['id', 'companyName'],
      },
    ],
  });
};

export const findJobById = async (id) => {
  return await Job.findByPk(id);
};

export const jobApply = async (jobId, jobSeekerId) => {
  const status = "pending";
  console.log(jobId, jobSeekerId)
  const data = await AppliedJob.create({ jobId, jobSeekerId, status });
  return data;
}
