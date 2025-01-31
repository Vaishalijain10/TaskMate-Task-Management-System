import express from "express";

import {
  verifyOtp,
  requestOtp,
  registerController,
  loginController,
  getUserDetails,
  editUserDetails,
  forgotPasswordController,
  requestForgotPasswordOtp,
  verifyForgotPasswordOtp,

} from "../controllers/userController.js";
const router = express.Router();

console.log(`At user Route`);

// @register
router.post("/request-otp", requestOtp);
router.post("/verify-otp", verifyOtp);
router.post("/register", registerController);

// @login
router.post("/login", loginController);

router.post("/getUserDetails", getUserDetails);

router.put("/editUserDetails", editUserDetails);

router.post("/request-forgot-password-otp", requestForgotPasswordOtp);
router.post("/verify-forgot-password-otp", verifyForgotPasswordOtp);
router.put("/forgot-password", forgotPasswordController);

export default router;
