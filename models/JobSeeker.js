import { DataTypes, Model }  from 'sequelize';
import sequelize  from '../config.js';
import User  from './User.js';

class JobSeekerProfile extends Model {}

JobSeekerProfile.init({
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  userId: {
    type: DataTypes.INTEGER,
    references: {
      model: User,
      key: 'id',
    },
  },
  resume: {
    type: DataTypes.TEXT,
  },
  skills: {
    type: DataTypes.TEXT,
  },
  experience: {
    type: DataTypes.TEXT,
  },
}, {
  sequelize,
  modelName: 'JobSeekerProfile',
});

export default JobSeekerProfile;
