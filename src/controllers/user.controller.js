import { User } from "../models/user.model.js";
import { options } from "../utils/index.js";
import { ApiErrorResponse } from "../utils/ApiErrorResponse.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { validateLoginUser, validteSignupUser } from "../utils/types.js";

const generateAccessAndRefreshToken = async (userId) => {
  try {
    const user = await User.findById(userId);
    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();
    // console.log(`accessToken:${accessToken},refreshToken: ${refreshToken}`);
    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false });
    return { accessToken, refreshToken };
  } catch (error) {
    console.log("something went wrong while generating token");
  }
};

const signupUser = async (req, res) => {
  try {
    const payload = req.body;
    console.log(payload);
    const validateUser = validteSignupUser.safeParse(payload);
    if (!validateUser.success)
      throw new ApiErrorResponse(400, "Invalid input format");
    const { username, email, password } = payload;
    const existUser = await User.findOne({ $or: [{ username }, { email }] });
    if (existUser) throw new ApiErrorResponse(409, "User already exists");
    const user = await User.create({ username, password, email });
    return res
      .status(200)
      .send(new ApiResponse(200, { user }, "usercreated successfully"));
  } catch (error) {
    console.log("something went wrong while signning up", error.message);
  }
};

const signinUser = async (req, res) => {
  const payload = req.body;
  console.log(payload);
  const validateUser = validateLoginUser.safeParse(payload);
  if (!validateUser.success)
    throw new ApiErrorResponse(400, "Invalid input format");
  const { username, password } = payload;
  const findUser = await User.findOne({ username });
  if (!findUser) throw new ApiErrorResponse(403, "User does not exist");
  const checkPassword = findUser.isPasswordCorrect(password);
  if (!checkPassword)
    throw new ApiErrorResponse(403, "Incorrect username or password");
  const { accessToken, refreshToken } = await generateAccessAndRefreshToken(
    findUser?._id
  );
  const loggedInUser = await User.findById(findUser?._id).select(
    "-password -refreshToken"
  );
  return res
    .status(200)
    .cookie("acccessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .send(
      new ApiResponse(200, {
        msg: "user loggedin successfully",
        accessToken,
        refreshToken,
        loggedInUser,
      })
    );
};

export { signupUser, signinUser };
