// models/Job.js

import { DataTypes, Model } from 'sequelize';
import sequelize from '../config.js'; // Adjust path as per your structure
import Industry from './Industry.js'; // Adjust path as per your structure
import EmployerProfile from './EmployerProfile.js';

class Job extends Model {}

Job.init({
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  employerId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: EmployerProfile,
      key: 'id',
    },
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  description: {
    type: DataTypes.TEXT,
  },
  requirements: {
    type: DataTypes.TEXT,
  },
  location: {
    type: DataTypes.STRING,
  },
  salary: {
    type: DataTypes.STRING,
  },
  type: {
    type: DataTypes.STRING,
  },
}, {
  sequelize,
  modelName: 'Job',
});

Job.belongsTo(EmployerProfile, {
  foreignKey: 'employerId',
  as: 'employer', // Define alias
});

Job.belongsToMany(Industry, {
  through: 'JobIndustry',
  foreignKey: 'jobId',
});

export default Job;
