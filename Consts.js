export const USER_ADMIN = "admin";
export const USER_EMPLOYER = "employer";
export const USER_JOB_SEEKER = "job_seeker";

export const EMAIL_TEMPLATE_IDS ={
    OTP_REGISTRATION :1
}

export const JOB_STATUS_IDS = {
    PENDING: 1,
    SUBMITTED: 2,
    REVIEWED: 3,
    INTERVIEW_SCHEDULED: 4,
    INTERVIEWED: 5,
    OFFERED: 6,
    ACCEPTED: 7,
    REJECTED: 8,
    WITHDRAWN: 9
};


export const EMAIL_TEMPLATE_REGISTER= {
    subject : "Complete Your Registration - OTP Verification",
    body : `
    <div style="font-family: Arial, sans-serif; line-height: 1.6;">
      <h2>Complete Your Registration</h2>
      <p>Hello, {userName},</p>
      <p>Thank you for registering with our job portal. To complete your registration, please use the following One-Time Password (OTP) to verify your email address:</p>
      <div style="font-size: 24px; font-weight: bold; text-align: center; margin: 20px 0; color: #333333;">{otp}</div>
      <p>This OTP is valid for the next 10 minutes. Please do not share this OTP with anyone.</p>
      <p>If you did not request this email, please ignore it.</p>
      <p>Thank you,<br>Job Portal Team</p>
    </div>
`
}
