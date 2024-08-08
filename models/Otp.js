import { DataTypes, Model } from 'sequelize';
import sequelize from '../config.js'; 

class Otp extends Model {}

Otp.init({
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  otp: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  valid_upto: {
    type: DataTypes.DATE,
    allowNull: false,
  },
}, {
  sequelize,
  modelName: 'otp',
    tableName :"otp"
});

export default Otp;
