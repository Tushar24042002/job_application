import { DataTypes } from 'sequelize';
import JobSeekerProfile from './JobSeeker.js';
import Job from './Job.js';
import sequelize from '../config.js';


const AppliedJob = sequelize.define('AppliedJob', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    jobSeekerId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: JobSeekerProfile, 
            key: 'id'
        }
    },
    jobId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: Job,
            key: 'id'
        }
    },
    status: {
        type: DataTypes.STRING(50),
        allowNull: false,
        defaultValue: 'applied'
    },
    appliedAt: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
    }
}, {
    timestamps: false, 
    tableName: 'appliedJobs'
});

export default AppliedJob;