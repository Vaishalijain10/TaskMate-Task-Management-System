// backend/services/ForgotPasswordService.js
import nodemailer from "nodemailer";

// Function to send OTP to user's email
async function sendPasswordEmail(email, otp) {
  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const mailOptions = {
      from: "TaskMate - Motivate, Collaborate, and Create!",
      to: email,
      subject: "OTP for Forgot Password TaskMate!",
      html: `
        <h1>Welcome Back to TaskMate - Motivate, Collaborate, and Create!!</h1>
        <p>Your OTP for reseting password is:</p>
        <h2 style="color:blue;">${otp}</h2>
        <p>This OTP will expire in 10 minutes</p>
        <br/>
        <p>Thank you!</p>
      `,
    };

    await transporter.sendMail(mailOptions);
    console.log("New Password sent successfully on email.");
  } catch (error) {
    console.log("Error sending new password on email:", error);
    throw error;
  }
}

export default sendPasswordEmail;
