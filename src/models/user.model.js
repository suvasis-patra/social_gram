import mongoose from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
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

userSchema.pre("save", async function encryptPassword(next) {
  if (!this.isModified("password")) next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

userSchema.generateAccessToken = function () {
  return jwt.sign({ _id: this._id }, process.env.JWT_SECRET, {
    expiresIn: process.env.ACCESS_TOKEN_EXPIRY,
  });
};

userSchema.methods.generateRefreshToken = function () {
  return jwt.sign({ _id: this._id }, process.env.JWT_SECRET, {
    expiresIn: process.env.ACCESS_TOKEN_EXPIRY,
  });
};

userSchema.methods.isPasswordCorrect = async function (password) {
  return await bcrypt.compare(password, this.password);
};

export const User = mongoose.model("User", userSchema);
