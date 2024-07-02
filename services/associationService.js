import Job from '../models/Job.js';
import EmployerProfile from '../models/EmployerProfile.js';
import Industry from '../models/Industry.js';

// Define associations
EmployerProfile.hasMany(Job, {
  foreignKey: 'employerId',
  as: 'jobs',
});

Job.belongsTo(EmployerProfile, {
  foreignKey: 'employerId',
  as: 'employer',
});


  Job.belongsToMany(Industry, {
    through: 'JobIndustry',
    foreignKey: 'jobId',
  });


