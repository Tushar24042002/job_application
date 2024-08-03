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
