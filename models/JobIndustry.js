// models/JobIndustry.js

import { DataTypes, Model } from 'sequelize';
import sequelize from '../config.js'; // Adjust path as per your structure

class JobIndustry extends Model {}

JobIndustry.init({
  jobId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  industryId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
}, {
  sequelize,
  modelName: 'JobIndustry',
  timestamps: false, // Assuming you don't need timestamps for this join table
});

export default JobIndustry;
