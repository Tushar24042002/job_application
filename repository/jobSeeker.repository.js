import { uploadFile } from "../aws/s3.js";
import upload from "../config/upload.js";
import JobSeeker from "../models/JobSeeker.js";
import fs from 'fs';
import { getCurrentUser } from "../services/user.service.js";


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
    await deleteFile(filePath);
    const user =await getCurrentUser(req,res);
    const jobSeekerData = {
      ...req.body,
      user_id : user.id,
      resume: resumeUrl // Store the resume URL in the JobSeeker profile
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



export const findJobSeekerByuser_id= async(user_id)=>{
  return await JobSeeker.findOne({where :{user_id}})
}