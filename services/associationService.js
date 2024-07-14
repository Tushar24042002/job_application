import Job from '../models/Job.js';
import EmployerProfile from '../models/EmployerProfile.js';
import Industry from '../models/Industry.js';
import AppliedJob from '../models/AppliedJobs.js';
import JobSeekerProfile from '../models/JobSeeker.js';
import User from '../models/User.js';

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



// JobSeeker has many AppliedJobs
JobSeekerProfile.hasMany(AppliedJob, {
  foreignKey: 'jobSeekerId',
  as: 'appliedJobs',
});

// AppliedJob belongs to JobSeeker
AppliedJob.belongsTo(JobSeekerProfile, {
  foreignKey: 'jobSeekerId',
  as: 'jobSeeker',
});

// AppliedJob belongs to Job
AppliedJob.belongsTo(Job, {
  foreignKey: 'jobId',
  as: 'job',
});
// Job has many AppliedJobs
Job.hasMany(AppliedJob, {
  foreignKey: 'jobId',
  as: 'appliedJobs',
});

JobSeekerProfile.belongsTo(User, {
  foreignKey: 'userId',
  as: 'user',
});