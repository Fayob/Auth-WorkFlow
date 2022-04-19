const User = require("../models/userModel");
const { StatusCodes } = require("http-status-codes");
const CustomError = require("../error-handlers");
const { attachCookiesToResponse, createTokenUser } = require("../utils");
const crypto = require("crypto");
const sendEmail = require("../utils/sendEmail");

const register = async (req, res) => {
  const { email, name, password } = req.body;

  if (!email || !name || !password) {
    throw new CustomError.BadRequestError("Please fill all form");
  }

  const checkEmail = await User.findOne({ email });
  if (checkEmail) {
    throw new CustomError.BadRequestError("Email Already Exist");
  }

  // first registered user is an admin
  const isFirstAccount = (await User.countDocuments({})) === 0;
  const role = isFirstAccount ? "admin" : "user";

  const verificationToken = crypto.randomBytes(40).toString("hex");

  const user = await User.create({
    name,
    email,
    password,
    role,
    verificationToken,
  });
  await sendEmail();

  // send verification token back only while testing in postman
  res.status(StatusCodes.CREATED).json({
    msg: "Success! Please check your email for account verification",
  });
};

const verifyEmail = async (req, res) => {
  const { verificationToken, email } = req.body;

  const user = await User.findOne({ email });

  if (!user) {
    throw new CustomError.UnauthenticatedError("Verification Failed");
  }
  if (user.verificationToken !== verificationToken) {
    throw new CustomError.UnauthenticatedError("Verification Failed");
  }

  user.isVerified = true;
  user.verified = Date.now();
  user.verificationToken = "";

  await user.save();

  res.status(StatusCodes.OK).json({ msg: "Email Verified" });
};

const login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    throw new CustomError.BadRequestError("Please provide email and password");
  }

  const user = await User.findOne({ email });

  if (!user) {
    throw new CustomError.UnauthenticatedError("Invalid Credentials");
  }

  const isPasswordCorrect = await user.comparePassword(password);
  if (!isPasswordCorrect) {
    throw new CustomError.UnauthenticatedError("Invalid Credentials");
  }

  if (!user.isVerified) {
    throw new CustomError.UnauthenticatedError("Please verify your email");
  }

  const tokenUser = createTokenUser(user);
  attachCookiesToResponse({ res, user: tokenUser });
  res.status(StatusCodes.OK).json({ user: tokenUser });
};

const logout = async (req, res) => {
  res.cookie("token", " ", {
    httpOnly: true,
    expires: new Date(Date.now()),
  });
  res.status(StatusCodes.OK).json({ msg: "User Logged Out" });
};

module.exports = {
  register,
  login,
  logout,
  verifyEmail,
};