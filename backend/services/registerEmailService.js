// services/registerEmailService.js
import nodemailer from "nodemailer";

// Function to send OTP to user's email
async function sendOtpEmail(email, otp) {
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
      subject: "TaskMate OTP for Registration!",
      html: `
        <h1>Welcome to TaskMate - Motivate, Collaborate, and Create!</h1>
        <p>Your OTP for completing registration is:</p>
        <h2 style="color:blue;">${otp}</h2>
        <p>This OTP will expire in 10 minutes.</p>
        <br/>
        <p>Thank you!</p>
      `,
    };

    await transporter.sendMail(mailOptions);
    console.log("OTP email sent successfully");
  } catch (error) {
    console.log("Error sending OTP email:", error);
    throw error;
  }
}

export default sendOtpEmail;
