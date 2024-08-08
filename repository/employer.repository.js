import { Sequelize, where } from "sequelize";
import sequelize from "../config.js";
import AppliedJob from "../models/AppliedJobs.js";
import EmployerProfile from "../models/EmployerProfile.js";
import Job from "../models/Job.js";
import JobSeekerProfile from "../models/JobSeeker.js";
import User from "../models/User.js";
import { getCurrentUser } from "../services/user.service.js";

export const addEmployerProfile = async (req, res) => {
        const user = await getCurrentUser(req, res);
        const user_id = user.id;
        const { company_name, company_description, company_website, employee_range } = req.body;
        const data = await EmployerProfile.create({ company_name, company_description, company_website, employee_range, user_id });
        return data;
}

export const updateEmployerProfile = async (req, res) => {
        const user = await getCurrentUser(req, res);
        const user_id = user.id;
        const { id,  company_name, company_description, company_website, employee_range } = req.body;
        const data = await EmployerProfile.update({ company_name, company_description, company_website, employee_range, user_id },  {where :{id}});
        return data;
}


export const findAllEmployers = async () => {
        return await EmployerProfile.findAll({
                attributes: {
                        exclude: ['user_id']
                },
                include: [
                        {
                                model: User,
                                as: 'user',
                                id: Sequelize.col("employer_profile.user_id"),
                                attributes: ['name', 'email'],
                        },
                ],
        });
}

export const findEmployerById = async (id) => {
        return await EmployerProfile.findByPk(id);
}



// export const getEmployerJobs = async (employerId) => {
//   try {
//     const employerJobs = await Job.findAll({
//       where: { employerId },
//       attributes: [
//         'id', 'title', 'description', 'createdAt', 'salary' , 'type',
//         [sequelize.literal('(SELECT COUNT(*) FROM `appliedJobs` AS `appliedJobs` WHERE `appliedJobs`.`jobId` = `Job`.`id`)'), 'applicationsCount'],
//       ],
//       group: ['Job.id', 'Job.title', 'Job.description', 'Job.createdAt'],
//     });

//     return employerJobs;
//   } catch (error) {
//     console.error('Error fetching employer jobs:', error);
//     throw error;
//   }
// };


export const getEmployerJobs = async (employerId, page, pageSize) => {
  try {
    const offset = (page - 1) * pageSize;

    // SQL query to fetch jobs and application count
    const query = `
      SELECT 
        j.id, 
        j.title, 
        j.description, 
        j."createdAt", 
        j.salary, 
        j.type,
        (SELECT COUNT(*) FROM applied_jobs WHERE applied_jobs.job_id = j.id) AS "applicationsCount"
      FROM 
        job j
      WHERE 
        j.employer_id = :employerId
      GROUP BY 
        j.id, j.title, j.description, j."createdAt", j.salary, j.type
      LIMIT :limit
      OFFSET :offset;
    `;

    // SQL query to count total jobs
    const countQuery = `
      SELECT COUNT(*) AS "totalJobs"
      FROM job
      WHERE employer_id = :employerId;
    `;

    // Execute the count query
    const countResult = await sequelize.query(countQuery, {
      replacements: { employerId },
      type: sequelize.QueryTypes.SELECT,
      logging: console.log,
    });

    const totalJobs = parseInt(countResult[0].totalJobs, 10);

    // Execute the main query to fetch job data
    const rows = await sequelize.query(query, {
      replacements: { employerId, limit: pageSize, offset },
      type: sequelize.QueryTypes.SELECT,
      logging: console.log,
    });

    const totalPages = Math.ceil(totalJobs / pageSize);

    return {
      pageData: {
        currentPage: page,
        totalPages,
        pageSize,
      },
      data: rows,
    };
  } catch (error) {
    console.error('Error fetching employer jobs:', error);
    throw error;
  }
};


// export const getEmployerJobs = async (employerId, page, pageSize) => {
//         try {
//                 const offset = (page - 1) * pageSize;

//                 const { count, rows } = await Job.findAndCountAll({
//                         where: { employerId },
//                         attributes: [
//                                 'id', 'title', 'description', 'createdAt', 'salary', 'type',
//                                 [sequelize.literal('(SELECT COUNT(*) FROM applied_jobs AS applied_jobs WHERE applied_jobs.job_id = Job.id)'), 'applicationsCount'],
//                         ],
//                         group: ['Job.id', 'Job.title', 'Job.description', 'Job.createdAt', 'Job.salary', 'Job.type'],
//                         limit: pageSize,
//                         offset: offset,
//                         logging: console.log 
//                 });

//                 const totalPages = Math.ceil(count / pageSize);

//                 return {
//                         pageData: {
//                                 currentPage: page,
//                                 totalPages,
//                                 pageSize
//                         },
//                         data: rows,
//                 };
//         } catch (error) {
//                 console.error('Error fetching employer jobs:', error);
//                 throw error;
//         }
// };

// export const findEmployerJobApplication = async (jobId, page, pageSize) => {
//         try {
//                 const offset = (page - 1) * pageSize;

//                 const { count, rows } = await AppliedJob.findAndCountAll({
//                         where: { jobId },
//                         attributes :{
//                                 exclude :['job_seeker_id']
//                         },
//                         include: [{
//                                 model: JobSeekerProfile,
//                                 as: "job_seeker",
//                                 id: Sequelize.col("AppliedJob.job_seeker_id"),
//                                 attributes :{
//                                         exclude :['user_id','resume','createdAt','updatedAt']
//                                 },
//                                 include: [
//                                         {
//                                                 model: User,
//                                                 as: "user",
//                                                 attributes :{
//                                                         exclude :['password','role','isverified','createdAt','updatedAt']
//                                                 },
//                                                 id: Sequelize.col("job_seeker.user_id"),
//                                         }
//                                 ]
//                         }],
//                         limit: pageSize,
//                         offset: offset,
//                 });
//                 const totalPages = Math.ceil(count / pageSize);

//                 return {
//                         pageData: {
//                                 currentPage: page,
//                                 totalPages,
//                                 pageSize
//                         },
//                         data: rows,
//                 };
//         } catch (error) {
//                 console.error('Error fetching employer jobs:', error);
//                 throw error;
//         }
// };



export const findEmployerJobApplication = async (jobId, page, pageSize) => {
  try {
    const offset = (page - 1) * pageSize;

    // SQL query to fetch job applications with job seeker and user details
    const query = `
      SELECT 
        aj.*,
        jsp.id AS "jobSeekerId", u.name,
        u.id AS "userId", u.email AS "userEmail", jsp.experience
      FROM 
        applied_jobs aj
      JOIN 
        job_seeker_profile jsp ON aj.job_seeker_id = jsp.id
      JOIN 
        users u ON jsp.user_id = u.id
      WHERE 
        aj.job_id = :jobId
      LIMIT :limit
      OFFSET :offset;
    `;

    // SQL query to count total job applications
    const countQuery = `
      SELECT COUNT(*) AS "totalApplications"
      FROM applied_jobs
      WHERE job_id = :jobId;
    `;

    // Execute the count query
    const countResult = await sequelize.query(countQuery, {
      replacements: { jobId },
      type: sequelize.QueryTypes.SELECT,
      logging: console.log,
    });

    const totalApplications = parseInt(countResult[0].totalApplications, 10);

    // Execute the main query to fetch job application data
    const rows = await sequelize.query(query, {
      replacements: { jobId, limit: pageSize, offset },
      type: sequelize.QueryTypes.SELECT,
      logging: console.log,
    });

    const totalPages = Math.ceil(totalApplications / pageSize);

    return {
      pageData: {
        currentPage: page,
        totalPages,
        pageSize,
      },
      data: rows,
    };
  } catch (error) {
    console.error('Error fetching employer job applications:', error);
    throw error;
  }
};
