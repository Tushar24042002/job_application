import Job from '../models/Job.js';
import EmployerProfile from '../models/EmployerProfile.js';
import Industry from '../models/Industry.js';

const setupAssociations = () => {
  Job.belongsTo(EmployerProfile, {
    foreignKey: 'employerId',
    as: 'employer',
  });

  EmployerProfile.hasMany(Job, {
    foreignKey: 'employerId',
    as: 'jobs',
  });

  Job.belongsToMany(Industry, {
    through: 'JobIndustry',
    foreignKey: 'jobId',
  });

  // Add other associations if needed
};

export default setupAssociations;
