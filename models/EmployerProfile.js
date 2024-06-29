import { DataTypes, Model } from 'sequelize';
import sequelize from '../config.js';
import User from './User.js';
import Job from './Job.js';

class EmployerProfile extends Model {}

EmployerProfile.init({
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
    allowNull: false,
    validate: {
      notNull: {
        msg: "user is required"
      },
      notEmpty: {
        msg: "user is required"
      }
    }
  },
  companyName: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notNull: {
        msg: "Company name is required"
      },
      notEmpty: {
        msg: "Company name is required"
      }
    }
  },
  companyDescription: {
    type: DataTypes.TEXT,
    allowNull: false,
    validate: {
      notNull: {
        msg: "Company description is required"
      },
      notEmpty: {
        msg: "Company description is required"
      }
    }
  },
  companyWebsite: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notNull: {
        msg: "Company website is required"
      },
      notEmpty: {
        msg: "Company website is required"
      }
    }
  },
}, {
  sequelize,
  modelName: 'EmployerProfile',
});

EmployerProfile.hasMany(Job, {
  foreignKey: 'employerId',
  as: 'jobs', // Define alias
});

// EmployerProfile.belongsTo(User, { foreignKey: 'userId' });
export default EmployerProfile;
