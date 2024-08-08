import { DataTypes } from 'sequelize';
import sequelize from '../config.js';
import User from './User.js';

const EmployerProfile = sequelize.define('EmployerProfile', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  user_id: {
    type: DataTypes.INTEGER,
    references: {
      model: User, 
      key: 'id',
    },
    unique: true,
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
  company_name: {
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
  company_description: {
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
  company_website: {
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
  employee_range: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notNull: {
        msg: "Employee Range is required"
      },
      notEmpty: {
        msg: "Employee Range is required"
      }
    }
  },
}, {
  sequelize,
  modelName: 'employer_profile',
  tableName :'employer_profile',
});

export default EmployerProfile;
