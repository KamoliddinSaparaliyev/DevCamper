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

  res.status(200).json({ success: true, data: user });
});
