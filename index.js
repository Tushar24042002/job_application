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
import "./services/associationService.js";
import cors from "cors";
const app = express();
const port = 5000;

app.use(bodyParser.json());
app.use(cors());


app.use("/users", userController);
app.use("/employer",employerController);
app.use("/job",JobContoller);
app.use("/industry", IndustryController);
app.use("/employee", JobSeekerController);

app.use(errorHandler);



sequelize.sync({force : false}).then(() => {  
    app.listen(port, () => {
        console.log(`Server is running on port ${port}`);
    })
}).catch(error => {
    console.error('Unable to synchronize the database:', error);
});