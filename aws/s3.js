import AWS from 'aws-sdk';
import fs from 'fs';
import path from 'path';
import { aws_buecket_name, aws_access_secret_key, aws_access_key } from '../config/aws_credentials.js';

// Configure AWS with your access and secret key.
AWS.config.update({
    accessKeyId: aws_access_key,
    secretAccessKey: aws_access_secret_key,
    region: 'eu-north-1'
});

// Create an S3 client
const s3 = new AWS.S3();

// Function to upload a file
export const uploadFile = (filePath, fileName) => {
    const fileContent = fs.readFileSync(filePath);
    const params = {
        Bucket: aws_buecket_name,
        Key: fileName, // File name you want to save as in S3
        Body: fileContent
    };

    return new Promise((resolve, reject) => {
        s3.upload(params, (err, data) => {
            if (err) {
                return reject(err);
            }
            resolve(data.Location);
        });
    });
};

// Function to download a file
export const downloadFile = (fileName, downloadPath) => {
    const params = {
        Bucket: aws_buecket_name,
        Key: fileName
    };

    // Downloading files from the bucket
    s3.getObject(params, (err, data) => {
        if (err) {
            throw err;
        }
        fs.writeFileSync(downloadPath, data.Body.toString());
        return true;
    });
};

