import Job from '../models/Job.js';
import EmployerProfile from '../models/EmployerProfile.js';
import Industry from '../models/Industry.js';
import AppliedJob from '../models/AppliedJobs.js';
import JobSeekerProfile from '../models/JobSeeker.js';
import User from '../models/User.js';

// Define associations
EmployerProfile.hasMany(Job, {
  foreignKey: 'employer_id',
  as: 'jobs',
});

Job.belongsTo(EmployerProfile, {
  foreignKey: 'employer_id',
  as: 'employer',
});


  Job.belongsToMany(Industry, {
    through: 'job_industry',
    foreignKey: 'job_id',
  });



// JobSeeker has many AppliedJobs
JobSeekerProfile.hasMany(AppliedJob, {
  foreignKey: 'job_seeker_id',
  as: 'applied_jobs',
});

// AppliedJob belongs to JobSeeker
AppliedJob.belongsTo(JobSeekerProfile, {
  foreignKey: 'job_seeker_id',
  as: 'job_seeker',
});

// AppliedJob belongs to Job
AppliedJob.belongsTo(Job, {
  foreignKey: 'job_id',
  as: 'job',
});
// Job has many AppliedJobs
Job.hasMany(AppliedJob, {
  foreignKey: 'job_id',
  as: 'applied_jobs',
});

JobSeekerProfile.belongsTo(User, {
  foreignKey: 'user_id',
  as: 'user',
});