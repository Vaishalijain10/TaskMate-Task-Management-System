// backend/controllers/userController.js
import bcrypt from "bcrypt";
import users from "../models/userModel.js";
import jwt from "jsonwebtoken";
import sendOtpEmail from "../services/registerEmailService.js";
import { generateOTP } from "../services/helperFuntions.js";
import { upload } from "../library/Multer.js";
import sendPasswordEmail from "../services/ForgotPasswordService.js";
import { GenerateNewPassword } from "../services/helperFuntions.js";

// Request OTP Controller
export async function requestOtp(req, res) {
  const { email, phoneNumber } = req.body;
  console.log(`backend : user Controller : request-Otp`);
  try {
    const otp = generateOTP();
    const otpExpiration = Date.now() + 10 * 60 * 1000;

    const already = await users.findOne({
      $or: [{ email: email }, { phoneNumber: phoneNumber }],
    });

    if (already) {
      console.log("THIS EMAIL OR CONTACT ALREADY PRESENT");
      return res.send({
        status: false,
        message: "Email or Phone Number already registered",
      });
    }
    console.log("New user");
    const newUser = await users({
      email: email,
      phoneNumber: phoneNumber,
      tempOtp: otp,
      otpExpiration,
    });

    console.log("process");
    await newUser.save();

    await sendOtpEmail(email, otp);
    res.send({ status: true, message: "OTP sent to email." });
  } catch (error) {
    console.log("Error in requestOtp:", error);
    res.send({ status: false, message: "OTP request failed." });
  }
}

// Verify OTP Controller
export async function verifyOtp(req, res) {
  console.log(`backend : user Controller : verify-Otp`);
  const { email, otp } = req.body;
  console.log(req.body);
  try {
    const user = await users.findOne({ email: email, tempOtp: otp });
    console.log(`backend : user Controller : verify-Otp : user : ${user}`);
    if (!user || user.otpExpiration < Date.now()) {
      return res.send({ status: false, message: "Invalid or expired OTP." });
    }

    await users.updateOne({ email }, { otp: null, otpExpiration: null });
    res.send({ status: true, message: "OTP verified successfully." });
  } catch (error) {
    console.log("Error in verifyOtp:", error);
    res.send({ status: false, message: "OTP verification failed." });
  }
}

// Register Controller
export async function registerController(req, res) {
  console.log("Received registration request");

  // Manually invoke multer's file upload handler
  const multerUpload = upload.single("profilePhoto");
  multerUpload(req, res, async (err) => {
    if (err) {
      console.error("Error uploading file:", err.message);
    }

    console.log("Request Body:", req.body);

    const { firstName, lastName, email, phoneNumber, password, profilePhoto } =
      req.body;

    try {
      console.log("Finding user by email...");
      const user = await users.findOne({ email });

      if (!user) {
        console.log("User not found, cannot register.");
        return res.send({ status: false, message: "User not found." });
      }

      console.log("Hashing password and digital pin...");
      const hashedPassword = await bcrypt.hash(password, 10);

      console.log("Saving user...");
      user.firstName = firstName;
      user.lastName = lastName;
      user.phoneNumber = phoneNumber;
      user.password = hashedPassword;
      user.tempOtp = null;
      user.profilePhoto = profilePhoto;

      await user.save();
      console.log("User registered successfully.");
      res.send({ status: true, message: "User registered successfully." });
    } catch (error) {
      console.error("Error during registration:", error);
      res.send({ status: false, message: "Error during registration." });
    }
  });
}

// login controller ->  phoneNumber or email, password
export async function loginController(req, res) {
  console.log(`userController : login`);
  const { email, password } = req.body;

  try {
    // Find the user by account number, phone number, or email
    const user = await users.findOne({
      email,
    });

    if (!user) {
      return res.send({
        status: false,
        message: "User not found. Please register first.",
      });
    }

    // Compare entered password with the hashed password in the database
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.send({ status: false, message: "Invalid credentials" });
    }

    // Generate JWT token
    const token = jwt.sign(
      { userId: user._id, email: user.email }, // Payload can include user details
      process.env.JWT_SECRET, // Use the secret from your .env file
      { expiresIn: "1h" }
    );

    res.send({ status: true, userData: user, token: token });
  } catch (error) {
    console.log(`userController : login controller : error : ${error}`);
    res.send({ status: false, message: "Something went wrong during login." });
  }
}

// Get user details (Fix: changed from req.params to req.body)
export async function getUserDetails(req, res) {
  try {
    const { userId } = req.body;
    if (!userId) {
      return res
        .status(400)
        .json({ status: false, message: "User ID is required" });
    }

    const user = await users.findById(userId).select("-password -tempOtp");
    if (!user) {
      return res.status(404).json({ status: false, message: "User not found" });
    }

    res.json({ status: true, user });
  } catch (error) {
    console.error(`Error fetching user details: ${error}`);
    res.status(500).json({ status: false, message: "Internal Server Error" });
  }
}

// Edit user details (Fix: used findByIdAndUpdate with { new: true })
export async function editUserDetails(req, res) {
  console.log(`userController : editUserDetails called`);
  const { userId, firstName, lastName, phoneNumber } = req.body;

  try {
    if (!userId || !firstName || !lastName || !phoneNumber) {
      return res
        .status(400)
        .json({ status: false, message: "All fields are required" });
    }

    const user = await users.findByIdAndUpdate(
      userId,
      { firstName, lastName, phoneNumber },
      { new: true, select: "-password -tempOtp" } // Return updated user without sensitive data
    );

    if (!user) {
      return res.status(404).json({ status: false, message: "User not found" });
    }

    console.log(`User details updated successfully for userId: ${userId}`);

    res.json({
      status: true,
      message: "User details updated successfully",
      user,
    });
  } catch (error) {
    console.log(`userController : editUserDetails : error : ${error}`);
    res
      .status(500)
      .json({
        status: false,
        message: "Something went wrong while updating details",
      });
  }
}

// request forgot password otp
export async function requestForgotPasswordOtp(req, res) {
  const { email } = req.body;
  console.log(`backend : user Controller : request-Otp`);
  try {
    const otp = GenerateNewPassword();
    const otpExpiration = Date.now() + 10 * 60 * 1000;

    await users.updateOne(
      { email: email },
      { tempOtp: otp, otpExpiration },
      { upsert: true }
    );

    await sendPasswordEmail(email, otp);
    res.send({ status: true, message: "OTP sent to email." });
  } catch (error) {
    console.log("Error in requestOtp:", error);
    res.send({ status: false, message: "OTP request failed." });
  }
}

// verify forgot password otp
export async function verifyForgotPasswordOtp(req, res) {
  console.log(`backend : user Controller : verify-Otp`);
  const { email, otp } = req.body;
  console.log(req.body);
  try {
    const user = await users.findOne({ email: email, tempOtp: otp });
    console.log(`backend : user Controller : verify-Otp : user : ${user}`);
    if (!user || user.otpExpiration < Date.now()) {
      return res.send({ status: false, message: "Invalid or expired OTP." });
    }

    await users.updateOne(
      { email },
      { otp: null, otpExpiration: null } // Clear OTP after verification
    );
    res.send({ status: true, message: "OTP verified successfully." });
  } catch (error) {
    console.log("Error in verifyOtp:", error);
    res.send({ status: false, message: "OTP verification failed." });
  }
}

// forgot password
export async function forgotPasswordController(req, res) {
  console.log(`userController : forgot password`);
  const { email, password } = req.body;

  try {
    const user = await users.findOne({ email });

    if (!user) {
      return res.send({
        status: false,
        message: "User not found. Please check your details.",
      });
    }

    // Hash the new password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Update the password
    user.password = hashedPassword;
    await user.save();

    console.log("Password reset successful");
    res.send({
      status: true,
      message: "Password reset successful",
    });
  } catch (error) {
    console.log(
      `userController : forgot password controller : error : ${error}`
    );
    res.send({
      status: false,
      message: "Something went wrong while resetting the password.",
    });
  }
}
