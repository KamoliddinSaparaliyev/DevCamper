const { config } = require("../config/config");
const asyncHandler = require("express-async-handler");
const { User } = require("../models/User");
const { ErrorResponse } = require("../utils/errorResponse");

/**
 * @desc Register User
 * @route POST /api/v1/auth/register
 * @access Public
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 * @param {import("express").NextFunction} next
 */
exports.register = asyncHandler(async (req, res, next) => {
  const { email, name, password, role } = req.body;

  const user = await User.create({
    name,
    password,
    email,
    role,
  });

  const token = user.getSignedJwtToken();

  res.status(200).json({ success: true, token });
});

/**
 * @desc Login User
 * @route POST /api/v1/auth/login
 * @access Public
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 * @param {import("express").NextFunction} next
 */
exports.login = asyncHandler(async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password)
    throw new ErrorResponse("Please provide an email and password", 400);

  const user = await User.findOne({ email }).select("+password");
  if (!user) throw new ErrorResponse("Invalid credebtials", 401);

  const isMatch = await user.matchPassword(password);

  if (!isMatch) throw new ErrorResponse("Invalid credebtials", 401);

  sendTokenResponse(user, 200, res);
});

const sendTokenResponse = (user, statusCode, res) => {
  const token = user.getSignedJwtToken();

  const currentDate = new Date();
  const date = config.jwt.cookie_expire * 1000 * 60 * 60 * 24;
  const futureDate = new Date(currentDate.getTime() + date);

  const options = {
    expires: futureDate,
    httpOnly: true,
  };

  if (config.node_env === "production") options.secure = true;

  res
    .status(statusCode)
    .cookie("token", token, options)
    .json({ success: true, token });
};
