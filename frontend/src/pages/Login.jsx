import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import loginImage from "../images/defaultImage.png";
import { AiTwotoneEye, AiTwotoneEyeInvisible } from "react-icons/ai";
import { LoginUser } from "../services/authService";

const Login = () => {
  const [form, setForm] = useState({ email: "", password: "" });
  const navigate = useNavigate();
  // Loading state for button
  const [loading, setLoading] = useState(false);
  const [passwordVisible, setPasswordVisible] = useState(false);

  const handleChange = (event) => {
    const { name, value } = event.target;

    setForm((prev) => {
      return {
        ...prev,
        [name]: name === "email" ? value.toLowerCase() : value,
      };
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    console.log("handleLoginSubmit");
    setLoading(true); // Set loading to true when submitting
    try {
      // LoginUser -> api/UserFunction.js
      const response = await LoginUser(form);
      if (response.status) {
        console.log(response.userData._id);
        toast.success("Login Successfully!");
        localStorage.setItem("token", response.token);
        localStorage.setItem("userId", response.userData._id);
        setLoading(false); // Set loading back to false after success
        return navigate("/home");
      } else {
        toast.error("Something went wrong!", response.message);
        setLoading(false); // Set loading back to false after failure
      }
    } catch (error) {
      toast.error("connectivity error");
      console.log("connectivity error", error);
      setLoading(false); // Set loading back to false after error
    }
  };

  return (
    <div className="flex justify-center items-center  h-screen bg-gray-200">
      {/* Container for Image & Form */}
      <div className="flex bg-white shadow-lg rounded-lg p-8 w-2/3">
        {/* Left Side - Image (50% width) */}
        <div className="w-1/2 flex justify-center items-center pr-8">
          <img
            src={loginImage}
            alt="Login Illustration"
            className="w-90 h-auto rounded-lg"
          />
        </div>

        {/* Right Side - Login Form (50% width) */}
        <form
          onSubmit={handleSubmit}
          className="w-1/2 bg-gray-200 p-6 rounded-lg shadow-md flex flex-col items-center"
        >
          <h2 className="text-2xl font-bold text-center mb-4">Login</h2>
          <input
            type="email"
            name="email"
            placeholder="Email"
            className="w-full p-2 border rounded mt-4"
            value={form.email}
            onChange={handleChange}
            required
          />
          <div className="relative w-full">
            <input
              type={passwordVisible ? "text" : "password"}
              name="password"
              placeholder="Password"
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
          <button
            type="submit"
            disabled={loading}
            className={`${
              loading ? "bg-gray-400" : "bg-navy"
            } w-full bg-blue-500 text-white p-2 mt-4 rounded hover:bg-blue-600`}
            onClick={handleSubmit}
          >
            {loading ? "Logging in..." : "Login"}
          </button>

          {/* Registration Link */}
          <p className="mt-4 text-sm">
            Don&apos;t have an account?{" "}
            <Link to="/register" className="text-blue-500 hover:underline">
              Register here!
            </Link>
          </p>
          <p className=" text-sm">
            Can&apos;t access your account?{" "}
            <Link to="/ForgotPassword" className="text-blue-500 hover:underline">
              Recover it now.
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Login;
