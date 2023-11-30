const { asyncHandler } = require("../middleware/async");
const { User } = require("../models/User");
const { ErrorResponse } = require("../utils/errorResponse");
const { findResourceById } = require("../utils/findModelById");

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

  const token = user.getSignedJwtToken();

  res.status(200).json({ success: true, token });
});
