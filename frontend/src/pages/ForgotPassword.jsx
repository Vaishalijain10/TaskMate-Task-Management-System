import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import ForgotPasswordImage from "../images/ForgotPassword.png";
import { AiTwotoneEye, AiTwotoneEyeInvisible } from "react-icons/ai";
import {
  requestForgotPasswordOtp,
  verifyForgotPasswordOtp,
  resetForgotPassword,
} from "../services/authService";

const ForgotPassword = () => {
  const [form, setForm] = useState({
    email: "",
    otp: "",
    password: "",
    confirmPassword: "",
  });
  const [loading, setLoading] = useState(false);
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false);
  const [otpRequested, setOtpRequested] = useState(false);
  const [otpVerified, setOtpVerified] = useState(false);

  const navigate = useNavigate();

  // Handle input change
  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  // Request OTP
  const handleGetOtp = async () => {
    if (!form.email) {
      toast.error("Please enter your email.");
      return;
    }
    setLoading(true);
    const response = await requestForgotPasswordOtp(form.email);
    if (response.status) {
      setOtpRequested(true);
      toast.success("OTP sent to your email.");
    } else {
      toast.error(response.message || "Error sending OTP.");
    }
    setLoading(false);
  };

  // Verify OTP
  const handleVerifyOtp = async () => {
    if (!form.email || !form.otp) {
      toast.error("Email and OTP are required.");
      return;
    }
    setLoading(true);
    const response = await verifyForgotPasswordOtp(form.email, form.otp);
    if (response.status) {
      setOtpVerified(true);
      toast.success("OTP verified successfully.");
    } else {
      toast.error(response.message || "Invalid OTP.");
    }
    setLoading(false);
  };

  // Reset Password
  const handleSubmit = async (event) => {
    event.preventDefault();
    if (form.password !== form.confirmPassword) {
      toast.error("Passwords do not match!");
      return;
    }
    setLoading(true);
    const response = await resetForgotPassword(form.email, form.password);
    if (response.status) {
      toast.success("Password reset successfully!");
      navigate("/");
    } else {
      toast.error(response.message || "Error resetting password.");
    }
    setLoading(false);
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gray-200">
      <div className="flex bg-white shadow-lg rounded-lg p-8 w-2/3">
        {/* Left Side - Image */}
        <div className="w-1/2 flex justify-center items-center pr-8">
          <img
            src={ForgotPasswordImage}
            alt="Forgot Password"
            className="w-90 h-auto rounded-lg"
          />
        </div>

        {/* Right Side - Form */}
        <form
          onSubmit={handleSubmit}
          className="w-1/2 bg-gray-200 p-6 rounded-lg shadow-md flex flex-col items-center"
        >
          <h2 className="text-2xl font-bold text-center mb-4">
            Forgot Password
          </h2>

          {/* Email Input */}
          <input
            type="email"
            name="email"
            placeholder="Enter your email"
            className="w-full p-2 border rounded mt-2"
            value={form.email}
            onChange={handleChange}
            required
            disabled={otpRequested}
          />

          {/* OTP Section */}
          {otpRequested && !otpVerified && (
            <>
              <input
                type="text"
                name="otp"
                placeholder="Enter OTP"
                className="w-full p-2 border rounded mt-2"
                value={form.otp}
                onChange={handleChange}
                required
              />
              <button
                type="button"
                onClick={handleVerifyOtp}
                disabled={loading}
                className="w-full bg-blue-600 text-white p-2 mt-4 rounded hover:bg-blue-700"
              >
                {loading ? "Verifying OTP..." : "Verify OTP"}
              </button>
            </>
          )}

          {/* Password Fields - Only Show After OTP Verification */}
          {otpVerified && (
            <>
              <div className="relative w-full">
                <input
                  type={passwordVisible ? "text" : "password"}
                  name="password"
                  placeholder="New Password"
                  className="w-full p-2 border rounded mt-4"
                  value={form.password}
                  onChange={handleChange}
                  required
                />
                <button
                  type="button"
                  onClick={() => setPasswordVisible(!passwordVisible)}
                  className="absolute top-1/2 right-3 mt-2 transform -translate-y-1/2 text-gray-500"
                >
                  {passwordVisible ? (
                    <AiTwotoneEyeInvisible size={20} />
                  ) : (
                    <AiTwotoneEye size={20} />
                  )}
                </button>
              </div>

              <div className="relative w-full">
                <input
                  type={confirmPasswordVisible ? "text" : "password"}
                  name="confirmPassword"
                  placeholder="Confirm Password"
                  className="w-full p-2 border rounded mt-4"
                  value={form.confirmPassword}
                  onChange={handleChange}
                  required
                />
                <button
                  type="button"
                  onClick={() =>
                    setConfirmPasswordVisible(!confirmPasswordVisible)
                  }
                  className="absolute top-1/2 right-3 mt-2 transform -translate-y-1/2 text-gray-500"
                >
                  {confirmPasswordVisible ? (
                    <AiTwotoneEyeInvisible size={20} />
                  ) : (
                    <AiTwotoneEye size={20} />
                  )}
                </button>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-blue-500 text-white p-2 mt-4 rounded hover:bg-blue-600"
              >
                {loading ? "Resetting Password..." : "Reset Password"}
              </button>
            </>
          )}

          {!otpRequested && (
            <button
              type="button"
              onClick={handleGetOtp}
              disabled={loading}
              className="w-full bg-blue-500 text-white p-2 mt-4 rounded hover:bg-blue-600"
            >
              {loading ? "Sending OTP..." : "Get OTP"}
            </button>
          )}
        </form>
      </div>
    </div>
  );
};

export default ForgotPassword;
