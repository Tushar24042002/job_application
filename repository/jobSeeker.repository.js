import { uploadFile } from "../aws/s3.js";
import upload from "../config/upload.js";
import JobSeeker from "../models/JobSeeker.js";
import fs from 'fs';
import { getCurrentUser } from "../services/user.service.js";
import AppliedJob from "../models/AppliedJobs.js";


const deleteFile = (filePath) => {
  return new Promise((resolve, reject) => {
    fs.unlink(filePath, (err) => {
      if (err) {
        console.error("Error deleting file:", err);
        reject(err);
      } else {
        console.log("File deleted successfully");
        resolve();
      }
    });
  });
};

export const addJobSeekerProfile = async (req, res) => {
  try {
    const uploadedFile = await new Promise((resolve, reject) => {
      upload.single('resume')(req, res, (err) => {
        if (err) {
          console.error("Error in upload file:", err);
          reject(err);
        } else {
          if (!req.file) {
            reject(new Error('No file uploaded'));
          } else {
            resolve(req.file);
          }
        }
      });
    });
    const filePath = uploadedFile.path;
    const fileName = `resumes/${uploadedFile.filename}`;
    const resumeUrl = await uploadFile(filePath, fileName);
    const user = await getCurrentUser(req, res);
    await deleteFile(filePath);
    const jobSeekerData = {
      ...req.body,
      resume: resumeUrl,
      userId: user.id
    };

    const data = await JobSeeker.create(jobSeekerData);
    return data;
  } catch (error) {
    console.error("Error creating job seeker profile:", error);
    throw new Error('Error creating job seeker profile');
  }
};


export const findAllJobSeekers = async () => {
  return await JobSeeker.findAll();
}

export const findJobSeekerById = async (id) => {
  return await JobSeeker.findByPk(id);
}

export const findJobSeekerByUserId = async (userId) => {
  return await JobSeeker.findOne({ where: { userId } });
}


export const findAllMyJobsByJobSeekerId= async(jobSeekerId)=>{
return await AppliedJob.findAll({where :{jobSeekerId}});
}