import express from 'express';
import { createUser, generateToken, getAllUsers, login, validateToken } from '../services/user.service.js';
import { isValidUser } from '../middleware/middleware.js';
import { USER_ADMIN, USER_EMPLOYER } from '../Consts.js';

const router = express.Router();

// Route to create a new user
router.post('/create', createUser);


router.get("/", isValidUser([USER_ADMIN, USER_EMPLOYER]), (req, res) => {
    getAllUsers(req, res);
  });
  router.post("/generate-token", generateToken)
  router.get("/validate-token", validateToken)
  router.post("/login", login);


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
