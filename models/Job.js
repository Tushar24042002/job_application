import { DataTypes } from 'sequelize';
import sequelize from '../config.js';
import Industry from './Industry.js';

const Job = sequelize.define('Job', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  employerId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'EmployerProfiles', // Refer to table name directly
      key: 'id',
    },
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: false,
    charset: 'utf8mb4', // Ensure UTF-8 encoding
    collate: 'utf8mb4_unicode_ci',
    get() {
        const rawValue = this.getDataValue('description');
        try {
            return JSON.parse(rawValue);
        } catch (error) {
            return rawValue;
        }
    },
    set(value) {
        this.setDataValue('description', JSON.stringify(value));
    }
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

Job.belongsToMany(Industry, {
  through: 'JobIndustry',
  foreignKey: 'jobId',
});

export default Job;
