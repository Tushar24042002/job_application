import { DataTypes } from 'sequelize';
import sequelize from '../config.js';
import Industry from './Industry.js';
import EmployerProfile from './EmployerProfile.js';

const Job = sequelize.define('Job', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  employer_id: {
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
  modelName: 'job',
  tableName :'job',
});

Job.belongsToMany(Industry, {
  through: 'job_industry',
  foreignKey: 'job_id',
});

export default Job;
