import { DataTypes, Model }  from 'sequelize';
import sequelize  from '../config';
import Job  from './Job';
import JobSeekerProfile  from './JobSeekerProfile';

class Application extends Model {}

Application.init({
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  job_id: {
    type: DataTypes.INTEGER,
    references: {
      model: Job,
      key: 'id',
    },
  },
  job_seeker_id: {
    type: DataTypes.INTEGER,
    references: {
      model: JobSeekerProfile,
      key: 'id',
    },
  },
  status: {
    type: DataTypes.STRING,
  },
  cover_letter: {
    type: DataTypes.TEXT,
  },
}, {
  sequelize,
  modelName: 'application',
  tableName :'application',
});

module.exports = Application;
