import express from 'express';
import bodyParser from 'body-parser';
import sequelize from './config.js';
// import jobRoutes from "./controllers/JobRoutes.js";
import { errorHandler } from './Exceptions/VaidationMiddleware.js';
import userController from "./controllers/user.controller.js";
import employerController from "./controllers/employer.controller.js"
import JobContoller from "./controllers/job.controller.js";
import IndustryController from "./controllers/industry.controller.js";
import JobSeekerController from "./controllers/jobSeeker.controller.js";
import { chatHandler } from './chat/chat.js'; 
import "./services/associationService.js";
import cors from "cors";
import { Server } from 'socket.io';
import http from 'http';
const app = express();
const port = 5000;
const server = http.createServer(app);
const io = new Server(server);
import WebSocket, { WebSocketServer } from 'ws';
app.use(bodyParser.json());
app.use(cors());

app.use("/users", userController);
app.use("/employer",employerController);
app.use("/job",JobContoller);
app.use("/industry", IndustryController);
app.use("/employee", JobSeekerController);

app.use(errorHandler);
const wss = new WebSocketServer({ port: 8080 });
// chatHandler(io);
wss.on('connection', (ws) => {
    console.log('A new client connected');
  
    // Handle incoming messages
    ws.on('message', (message) => {
      console.log(`Received message: ${message}`);
      
      // Broadcast the message to all connected clients
      wss.clients.forEach((client) => {
        if (client.readyState === WebSocket.OPEN) {
          client.send(message);
        }
      });
    });
  
    // Handle client disconnection
    ws.on('close', () => {
      console.log('Client disconnected');
    });
  });





sequelize.sync({force : false}).then(() => {  
    app.listen(port, () => {
        console.log(`Server is running on port ${port}`);
    })
}).catch(error => {
    console.error('Unable to synchronize the database:', error);
});



import EmailTemplate from "./models/EmailTemplate.js";


export const addEmail = async (subject, body) => {
    try {
        const data = await EmailTemplate.create({ subject, body });
        console.log(data)
    } catch (error) {
        if (error.name === 'SequelizeValidationError') {
           console.log(error);
        } else {
           console.log(error);
        }
    }
}

await addEmail("Complete Your Registration - OTP Verification", `
    <div style="font-family: Arial, sans-serif; line-height: 1.6;">
      <h2>Complete Your Registration</h2>
      <p>Hello, {userName},</p>
      <p>Thank you for registering with our job portal. To complete your registration, please use the following One-Time Password (OTP) to verify your email address:</p>
      <div style="font-size: 24px; font-weight: bold; text-align: center; margin: 20px 0; color: #333333;">{otp}</div>
      <p>This OTP is valid for the next 10 minutes. Please do not share this OTP with anyone.</p>
      <p>If you did not request this email, please ignore it.</p>
      <p>Thank you,<br>Job Portal Team</p>
    </div>
`)


await addEmail("Job Application Status Update",`
    <div style="font-family: Arial, sans-serif; line-height: 1.6;">
      <h2>Job Application Status Update</h2>
      <p>Dear {userName},</p>
      <p>We are writing to inform you that the status of your application for the position of <strong>{jobTitle}</strong> has been updated.</p>
      <p><strong>Status Update:</strong> {statusMessage}</p>
      <p>Thank you for your interest in joining our team. If you have any questions, please feel free to reach out to us.</p>
      <p>Best regards,</p>
      <p>The Hiring Team</p>
    </div>
  `)
