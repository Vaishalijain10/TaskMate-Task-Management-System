import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import registerImage from "../images/Picture.png";
import { AiTwotoneEye, AiTwotoneEyeInvisible } from "react-icons/ai";
import { registerUser, requestOtp, verifyOtp } from "../services/authService";

const Register = () => {
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phoneNumber: "",
    password: "",
    confirmPassword: "",
    tempOtp: "",
    profilePhoto: "",
  });
  const [otpRequested, setOtpRequested] = useState(false);
  const [otpVerified, setOtpVerified] = useState(false);
  // const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // Request OTP
  const handleGetOtp = async () => {
    if (!form.email || !form.phoneNumber) {
      toast.error("Email and Phone Number are required!");
      return;
    }
    setLoading(true);
    try {
      const response = await requestOtp({
        email: form.email,
        phoneNumber: form.phoneNumber,
      });

      if (response.status) {
        setOtpRequested(true);
        toast.success("OTP sent to your email.");
      } else {
        toast.error(response.message || "Error sending OTP.");
      }
    } catch {
      toast.error("Error requesting OTP.");
    } finally {
      setLoading(false);
    }
  };

  // Verify OTP
  const handleVerifyOtp = async () => {
    if (!form.email || !form.tempOtp) {
      toast.error("Email and OTP are required!");
      return;
    }
    setLoading(true);
    try {
      const response = await verifyOtp(form.email, form.tempOtp);

      if (response.status) {
        setOtpVerified(true);
        toast.success("OTP verified successfully.");
      } else {
        toast.error(response.message || "Invalid or expired OTP.");
      }
    } catch {
      toast.error("Error verifying OTP. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Handle Image Upload
  const uploadImage = async (file) => {
    if (!file) {
      toast.error("Please select an image to upload.");
      return;
    }
    setLoading(true);
    try {
      const data = new FormData();
      data.append("file", file);
      data.append("upload_preset", "TaskMate-System");
      data.append("cloud_name", "vaishalijain");

      const response = await fetch(
        "https://api.cloudinary.com/v1_1/vaishalijain/image/upload",
        {
          method: "POST",
          body: data,
        }
      );

      const result = await response.json();
      if (result.secure_url) {
        setForm((prev) => ({ ...prev, profilePhoto: result.secure_url }));
        toast.success("Image uploaded successfully!");
      } else {
        toast.error("Failed to upload image. Please try again.");
      }
    } catch {
      toast.error("Failed to upload image. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Handle file change
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) uploadImage(file);
  };

  // Submit Registration
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.password !== form.confirmPassword) {
      toast.error("Passwords do not match!");
      return;
    }
    if (!otpVerified) {
      toast.error("OTP must be verified first!");
      return;
    }

    setLoading(true);
    try {
      // Prepare form data for submission
      const formDataToSubmit = new FormData();
      Object.keys(form).forEach((key) => {
        if (form[key]) {
          formDataToSubmit.append(key, form[key]);
        }
      });

      // Submit the registration form
      const response = await registerUser(formDataToSubmit);

      if (response.status) {
        toast.success("Registered Successfully!");
        navigate("/");
      } else {
        toast.error(response.message || "Registration failed.");
      }
    } catch {
      toast.error("Registration error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gray-200">
      <div className="flex bg-white shadow-lg rounded-lg p-4 w-2/3 ">
        <div className="w-1/2 flex justify-center items-center pr-4">
          <img
            src={registerImage}
            alt="Register Illustration"
            className="w-90 h-auto rounded-lg"
          />
        </div>
        <form
          onSubmit={handleSubmit}
          className="w-1/2 bg-gray-200 p-6 rounded-lg shadow-md shadow-gray-200 flex flex-col items-center overflow-y-auto max-h-[68vh]"
        >
          <h2 className="text-2xl font-bold text-center mb-4">Register</h2>
          <input
            type="text"
            name="firstName"
            placeholder="First Name"
            className="w-full p-2 border rounded mt-2"
            value={form.firstName}
            onChange={handleChange}
            required
          />
          <input
            type="text"
            name="lastName"
            placeholder="Last Name"
            className="w-full p-2 border rounded mt-2"
            value={form.lastName}
            onChange={handleChange}
            required
          />
          <div className="relative w-full mt-2">
            <input
              type="email"
              name="email"
              placeholder="Email"
              className="w-full p-2 border rounded"
              value={form.email}
              onChange={handleChange}
              required
            />
            {!otpRequested && (
              <button
                type="button"
                onClick={handleGetOtp}
                disabled={loading}
                className="absolute right-2 top-1/2 transform -translate-y-1/2 px-3 py-1 bg-green-600 text-white rounded"
              >
                {loading ? "Sending OTP..." : "Get OTP"}
              </button>
            )}
          </div>

          {otpRequested && (
            <>
              <input
                type="text"
                name="tempOtp"
                placeholder="Enter OTP"
                className="w-full p-2 border rounded mt-2"
                value={form.tempOtp}
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

          <input
            type="text"
            name="phoneNumber"
            placeholder="Phone Number"
            className="w-full p-2 border rounded mt-2"
            value={form.phoneNumber}
            onChange={handleChange}
            required
          />
          <div className="relative w-full">
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              placeholder="Password"
              className="w-full p-2 border rounded mt-2"
              value={form.password}
              onChange={handleChange}
              onClick={() => setShowPassword((prev) => !prev)} // Toggle visibility
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword((prev) => !prev)} // Toggle visibility
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-600 items-center"
            >
              {showPassword ? <AiTwotoneEyeInvisible /> : <AiTwotoneEye />}
            </button>
          </div>
          <div className="relative w-full">
            <input
              type={showPassword ? "text" : "password"}
              name="confirmPassword"
              placeholder="Confirm Password"
              className="w-full p-2 border rounded mt-2"
              value={form.confirmPassword}
              onChange={handleChange}
              onClick={() => setShowPassword((prev) => !prev)} // Toggle visibility
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword((prev) => !prev)} // Toggle visibility
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-600 items-center"
            >
              {showPassword ? <AiTwotoneEyeInvisible /> : <AiTwotoneEye />}
            </button>
          </div>

          <div className="mt-1">
            <label>Upload Profile Photo</label>
            <input type="file" accept="image/*" onChange={handleFileChange} />
            {form.profilePhoto && (
              <img src={form.profilePhoto} alt="Profile" width="100" />
            )}
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`w-full bg-green-600 text-white p-2 mt-4 rounded ${
              loading ? "bg-gray-400 cursor-not-allowed" : "bg-navy text-white"
            }`}
          >
            {loading ? "Registering..." : "Register"}

          </button>
          <p className="text-center text-sm mt-2">
            Already have an account?{" "}
            <Link to="/" className="text-blue-500 hover:underline">
              Login
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Register;
