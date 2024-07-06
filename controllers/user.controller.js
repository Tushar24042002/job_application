import express from 'express';
import { createUser, getAllUsers } from '../services/user.service.js';

const router = express.Router();

// Route to create a new user
router.post('/create', createUser);

// Route to get all users
router.get('/', abc);



function abc(request, response) {
    var filePath = path.resolve("1719058470287_output.pdf");
    console.log("working")
    response.download(filePath, function(err) {
        if (err) {
            console.log(err); // Check error if you want
        } else {
            fs.unlink(filePath, function(err) {
                if (err) {
                    console.log(err); // Check error if you want
                } else {
                    console.log("File was deleted"); // Callback
                }
            });
        }
    });
}


export default router;
