// jobProfileService.js

import sequelize from "../config.js";
import Job from "../models/Job.js";
import Industry from "../models/Industry.js";
import JobIndustry from "../models/JobIndustry.js";
import EmployerProfile from "../models/EmployerProfile.js";
import { Sequelize } from "sequelize";

export const addJobProfile = async (req) => {
  const {
    title,
    description,
    requirements,
    employerId,
    location,
    salary,
    type,
    industryIds,
  } = req.body;

  const transaction = await sequelize.transaction();

  try {
    // Create job profile

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
      IndustryId : industryId,
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
