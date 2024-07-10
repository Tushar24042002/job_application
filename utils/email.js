import dotenv from 'dotenv';
import Queue from 'bull';
import nodemailer from 'nodemailer';


dotenv.config();

const emailQueue = new Queue('emailQueue', {
    redis: {
      host: '127.0.0.1', 
      port: 6379,        
      maxRetriesPerRequest: 50 
    }
  });

// Event listeners for the queue
emailQueue.on('completed', (job, result) => {
  console.log(`Job completed with result: ${result}`);
});

emailQueue.on('failed', (job, err) => {
  console.log(`Job failed with error: ${err}`);
});

emailQueue.on('error', (err) => {
  console.error(`Queue error: ${err}`);
});

// Define a process for the queue
emailQueue.process(async (job, done) => {
  let transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 587,
    secure: false,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    }
  });


  let mailOptions = {
    from: process.env.EMAIL_USER,
    to: job.data.to,
    subject: job.data.subject,
    html: job.data.text
  };

  try {
    let info = await transporter.sendMail(mailOptions);
    console.log('Email sent: ' + info.response);
    done(info.response);
  } catch (error) {
    console.error('Error sending email:', error);
    done(error);
  }
});

// Function to add an email job to the queue
export const  sendEmail=(to, subject, text)=> {
  emailQueue.add({ to, subject, text });
}


