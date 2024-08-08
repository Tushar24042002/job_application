import express from 'express';
import { addEmail } from '../services/emailService.js';
const router = express.Router();

router.post("/add-email-template", (req, res) => {
    addEmail(req, res);
  });


export default router;
