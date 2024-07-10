// models/EmailTemplate.js

import { DataTypes, Model } from 'sequelize';
import sequelize from '../config.js'; // Adjust path as per your structure

class EmailTemplate extends Model { }

EmailTemplate.init({
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    subject: {
        type: DataTypes.STRING,
    },
    body: {
        type: DataTypes.TEXT,
    },
}, {
    sequelize,
    modelName: 'emailTemplate',
    timestamps: false,
});

export default EmailTemplate;
