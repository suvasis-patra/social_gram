import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    username: {
      tyep: String,
      required: [true, "Enter username"],
      trim: true,
      lowercase: true,
    },
    email: {
      type: String,
      required: [true, "Enter a valid email"],
      lowercase: true,
      unique: true,
      trim: true,
    },
    password: {
      type: String,
      required: [true, "Enter a valid passowrd"],
      unique: true,
      trim: true,
    },
    refreshToken: {
      type: String,
    },
    profileImage: {
      type: String, // cloudnary url
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

export const User = mongoose.model("User", userSchema);
