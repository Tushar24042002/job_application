import sequelize from "../config.js";
import AppliedJob from "../models/AppliedJobs.js";
import EmployerProfile from "../models/EmployerProfile.js";
import Job from "../models/Job.js";
import User from "../models/User.js";
import { getCurrentUser } from "../services/user.service.js";

export const addEmployerProfile = async (req, res) => {
        const user = await getCurrentUser(req, res);
        const userId = user.id;
        const { companyName, companyDescription, companyWebsite, employeeRange } = req.body;
        const data = await EmployerProfile.create({ companyName, companyDescription, companyWebsite, employeeRange, userId });
        return data;
}


export const findAllEmployers = async () => {
        return await EmployerProfile.findAll({
                attributes: {
                        exclude: ['userId']
                },
                include: [
                        {
                                model: User,
                                as: 'user',
                                id: Sequelize.col("EmployerProfile.userId"),
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

                const { count, rows } = await Job.findAndCountAll({
                        where: { employerId },
                        attributes: [
                                'id', 'title', 'description', 'createdAt', 'salary', 'type',
                                [sequelize.literal('(SELECT COUNT(*) FROM appliedJobs AS appliedJobs WHERE appliedJobs.jobId = Job.id)'), 'applicationsCount'],
                        ],
                        group: ['Job.id', 'Job.title', 'Job.description', 'Job.createdAt', 'Job.salary', 'Job.type'],
                        limit: pageSize,
                        offset: offset,
                });

                const totalPages = Math.ceil(count.length / pageSize); // count.length because it's an array due to GROUP BY

                return {
                        pageData: {
                                currentPage: page,
                                totalPages,
                                pageSize
                        },
                        data: rows,
                };
        } catch (error) {
                console.error('Error fetching employer jobs:', error);
                throw error;
        }
};



