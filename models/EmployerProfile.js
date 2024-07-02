import { DataTypes } from 'sequelize';
import sequelize from '../config.js';

const EmployerProfile = sequelize.define('EmployerProfile', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  userId: {
    type: DataTypes.INTEGER,
    references: {
      model: 'Users', // Refer to table name directly
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
  employeeRange: {
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
  modelName: 'EmployerProfile',
});

export default EmployerProfile;
