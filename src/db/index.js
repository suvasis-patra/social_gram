import mongoose from "mongoose";
import { ApiErrorResponse } from "../utils/ApiErrorResponse.js";
import { DB_NAME } from "../constant.js";

const connectDB = async () => {
  try {
    const connectionInstance = await mongoose.connect(
      `${process.env.MONGO_URI}/${DB_NAME}`
    );
    console.log("DB is connected");
  } catch (error) {
    throw new ApiErrorResponse(500, error);
  }
};

export { connectDB };
