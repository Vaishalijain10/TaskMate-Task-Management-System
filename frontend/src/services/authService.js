  import axios from "axios";
  import { userUrl } from "./URL";

  // @ Register function
    // get Otp
    export const requestOtp = async (obj) => {
      try {
        console.log("Initiating OTP request...");

        const response = await fetch(`${userUrl}/request-otp`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(obj),
        });

        console.log(`requestOtp: response: ${response}`);

        if (!response.ok) {
          throw new Error(`Error ${response.status}: ${response.statusText}`);
        }

        const data = await response.json();
        console.log(`requestOtp: data: ${data}`);

        return data; // Return the parsed data for use in the main function
      } catch (error) {
        console.error("Error in requestOtp:", error);
        return {
          status: false,
          message: "Failed to request OTP. Please try again.",
        };
      }
    };
    // verify otp
    export const verifyOtp = async (email, otp) => {
      try {
        console.log("Initiating OTP verification...");

        const response = await fetch(`${userUrl}/verify-otp`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email, otp }),
        });

        console.log(`verifyOtp: response: ${response}`);

        if (!response.ok) {
          throw new Error(`Error ${response.status}: ${response.statusText}`);
        }

        const data = await response.json();
        console.log(`verifyOtp: data: ${data}`);

        return data; // Return the parsed data for further use
      } catch (error) {
        console.error("Error in verifyOtp:", error);
        return {
          status: false,
          message: "Failed to verify OTP. Please try again.",
        };
      }
    };

  // registration details saving in database
  export const registerUser = async (formDataToSubmit) => {
    try {
      console.log("registerUser: Sending registration data to backend...");
      const response = await axios.post(`${userUrl}/register`, formDataToSubmit);
      console.log("registerUser: Response received:", response.data);
      return response.data;
    } catch (error) {
      console.error("registerUser: Error during registration:", error);
      return {
        status: false,
        message: "Failed to register. Please try again later.",
      };
    }
  };

  // @ Login Function
  export const LoginUser = async (FormData) => {
    try {
      console.log("Reached login: frontend API");

      // Make the POST request to the login endpoint
      const response = await axios.post(`${userUrl}/login`, FormData);
      // localStorage.setItem("token", data.token);
      console.log("Login API response:", response.data);

      return response.data; // Return the parsed response data
    } catch (error) {
      console.error("Error in LoginUser:", error);
      return { status: false, message: "API Error. Please try again later." }; // Gracefully return an error response
    }
  };

  // @ forgot-password
  // get otp
  export const requestForgotPasswordOtp = async (email) => {
    try {
      // Make the POST request to the API endpoint for OTP
      const response = await axios.post(
        `${userUrl}/request-forgot-password-otp`,
        { email }
      );

      // Return the response data for further processing
      return response.data;
    } catch (error) {
      // Catch and handle any error that occurs during the API call
      console.error("Error during OTP API call:", error);
      throw new Error("Failed to send OTP");
    }
  };
  // verify otp
  export const verifyForgotPasswordOtp = async (email, otp) => {
    try {
      // Make the POST request to the API for OTP verification
      const response = await axios.post(`${userUrl}/verify-forgot-password-otp`, {
        email,
        otp,
      });

      // Return the response data for further processing
      return response.data;
    } catch (error) {
      // Catch and handle any error that occurs during the API call
      console.error("Error during OTP verification API call:", error);
      throw new Error("Failed to verify OTP");
    }
  };

  // saving new password in the database
  export const resetForgotPassword = async (email, password) => {
    try {
      // Make the PUT request to the API for password reset
      const response = await axios.put(`${userUrl}/forgot-password`, {
        email,
        password,
      });

      // Return the response data for further processing
      return response.data;
    } catch (error) {
      // Catch and handle any error that occurs during the API call
      console.error("Error during password reset API call:", error);
      throw new Error("Failed to reset password");
    }
  };

  // Get user details (Fix: Changed from GET to POST)
  export const getUserDetails = async (userId) => {
    try {
      if (!userId) throw new Error("User ID is required");

      const response = await axios.post(`${userUrl}/getUserDetails`, { userId });
      console.log("getUserDetails response:", response.data);

      return response.data;
    } catch (error) {
      console.error("Error fetching user details:", error);
      return { status: false, message: "Failed to fetch user details" };
    }
  };

  // Edit user details (Fix: Updated API call structure)
  export const editUserDetails = async (userId, updatedData) => {
    try {
      if (!userId || !updatedData) throw new Error("Missing required fields");

      const response = await axios.put(`${userUrl}/editUserDetails`, {
        userId,
        ...updatedData,
      });

      console.log("editUserDetails response:", response.data);

      return response.data;
    } catch (error) {
      console.error("Error updating user details:", error);
      return { status: false, message: "Failed to update user details" };
    }
  };

  // logout
  export const logout = () => {
    localStorage.removeItem("token");
  };
