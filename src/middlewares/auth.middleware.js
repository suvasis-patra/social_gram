import { User } from "../models/user.model";
import { ApiErrorResponse } from "../utils/ApiErrorResponse";
import jwt from "jsonwebtoken";
const authenticateUser = async (req, _, next) => {
  try {
    const token =
      req.cookies.accessToken ||
      req.header("Authorization")?.replace("Bearer ", "");

    if (!token) throw new ApiErrorResponse(400, "Unauthorized user");

    const payload = jwt.verify(token, process.env.JWT_SECRET);
    if (!payload) throw new ApiErrorResponse(400, "user does not exist");
    const user = await User.findById(payload._id);
    req.user = user;
    next();
  } catch (error) {
    console.log("something went wrong while authentication", error.message);
  }
};

export { authenticateUser };
