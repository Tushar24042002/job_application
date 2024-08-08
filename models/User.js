import { DataTypes, Model } from 'sequelize';
import sequelize from '../config.js';

class User extends Model { }

User.init({
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    role: {
        type: DataTypes.ENUM('admin', 'employer', 'job_seeker'),
        allowNull: false,
    },
    isverified : {
        type : DataTypes.BOOLEAN,
        defaultValue : false
    }
}, {
    sequelize,
    modelName: 'users',
    tableName :"users"
});

export default User;
