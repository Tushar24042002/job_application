// models/JobIndustry.js

import { DataTypes, Model } from 'sequelize';
import sequelize from '../config.js'; // Adjust path as per your structure

class JobIndustry extends Model {}

JobIndustry.init({
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  job_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  industry_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
}, {
  sequelize,
  modelName: 'job_industry',
  tableName :'job_industry',
  timestamps: true, 
});

export default JobIndustry;
