import Job from '../models/Job.js';
import EmployerProfile from '../models/EmployerProfile.js';
import Industry from '../models/Industry.js';
import AppliedJob from '../models/AppliedJobs.js';

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

  Job.hasMany(AppliedJob, { as: 'appliedJobs', foreignKey: 'jobId' });
