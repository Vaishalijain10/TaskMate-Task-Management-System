import mongoose from "mongoose";

const UserSchema = mongoose.Schema(
  {
    firstName: {
      type: String,
    },
    lastName: {
      type: String,
    },
    email: {
      type: String,
      unique: true,
    },
    phoneNumber: {
      type: String,
      unique: true,
    },
    password: {
      type: String,
    },
    profilePhoto: {
      type: String,
      default:
        "https://res.cloudinary.com/vaishalijain/image/upload/v1738150381/TaskMate-System/defaultImage_q1pfte.png",
    },
    tempOtp: {
      type: String,
    },
  },
  { timestamps: true }
);

const users = mongoose.model("users", UserSchema);

export default users;
