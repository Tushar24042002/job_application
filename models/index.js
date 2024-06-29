import sequelize from '../config.js'; // Adjust path as per your structure
import Job from './Job.js';
import EmployerProfile from './EmployerProfile.js';
import Industry from './Industry.js';
import setupAssociations from '../associations.js'; // Adjust path as per your structure

const models = {
  Job,
  EmployerProfile,
  Industry,
};

setupAssociations();

export default models;
