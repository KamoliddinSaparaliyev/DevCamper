const crypto = require("crypto");
const asyncHandler = require("express-async-handler");
const { config } = require("../config/config");
const { User } = require("../models/User");
const { ErrorResponse } = require("../utils/errorResponse");
const { sendEmail } = require("../utils/sendEmail");

/**
 * @desc Register User
 * @route POST /api/v1/auth/register
 * @access Public
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

/**
 * @desc Logout User
 * @route GET /api/v1/auth/logout
 * @access Private
 */
exports.logout = asyncHandler(async (req, res, next) => {
  res.cookie("token", "none", {
    expires: new Date(Date.now() + 10 * 1000),
    httpOnly: true,
  });

  res.status(200).json({ success: true, data: {} });
});

/**
 * @desc Get Current User
 * @route POST /api/v1/auth/me
 * @access Private
 */
exports.getMe = asyncHandler(async (req, res, next) => {
  res.status(200).json({ success: true, data: req.user });
});

/**
 * @desc Forget password
 * @route POST /api/v1/auth/forgetpassword
 * @access Public
 */
exports.forgetPassword = asyncHandler(async (req, res, next) => {
  const { email } = req.body;

  const user = await User.findOne({ email });

  if (!user) {
    return next(
      new ErrorResponse(`Resource not found with email ${email}`, 404)
    );
  }

  const resetToken = user.getResetPasswordToken();

  // Create reset URL
  const resetUrl = `${req.protocol}://${req.get(
    "host"
  )}/api/v1/auth/resetpassword/${resetToken}`;

  const message = `You are receiving this email because you (or someone else) has requested a password reset. Please make a PUT request to: \n\n ${resetUrl}`;

  try {
    await sendEmail({
      email: user.email,
      subject: "Password Reset Token",
      message,
    });

    res.status(200).json({ success: true, data: "Email sent" });
  } catch (error) {
    console.error(error);

    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;

    await user.save({ validateBeforeSave: false });

    return next(new ErrorResponse("Email could not be sent", 500));
  }
});

/**
 * @desc Reset Password
 * @route POST /api/v1/auth/forgetpassword/:resettoken
 * @access Public
 */
exports.resetPassword = asyncHandler(async (req, res, next) => {
  const { resettoken } = req.params;

  const resetPasswordToken = crypto
    .createHash("sha256")
    .update(resettoken)
    .digest("hex");

  const user = await User.findOne({
    resetPasswordToken,
    resetPasswordExpire: { $gt: Date.now() },
  });

  if (!user) {
    console.log("Token:", resettoken);
    console.log("Hashed Token:", resetPasswordToken);
    console.log("User:", user);
    return next(new ErrorResponse("Invalid or expired token", 400));
  }

  user.password = req.body.password;
  user.resetPasswordExpire = undefined;
  user.resetPasswordToken = undefined;
  await user.save();

  sendTokenResponse(user, 200, res);
});

/**
 * @desc Update User Details
 * @route PUT /api/v1/auth/updatedetails
 * @access Private
 */
exports.updateDetails = asyncHandler(async (req, res, next) => {
  const { email, name } = req.body;
  const fieldsToUpdate = {
    email,
    name,
  };

  const user = await User.findByIdAndUpdate(
    req.user.id,
    { fieldsToUpdate },
    { new: true, runValidators: true }
  );

  res.status(200).json({ success: true, data: user });
});

/**
 * @desc Update User Details
 * @route PUT /api/v1/auth/updatepassword
 * @access Private
 */
exports.updatePassword = asyncHandler(async (req, res, next) => {
  const { currentPassword, newPassword } = req.body;

  const user = await User.findById(req.user.id).select("+password");

  const isMatch = user.matchPassword(currentPassword);

  if (!isMatch) throw new ErrorResponse("Passowrd is incorrect", 401);

  user.password = newPassword;

  await user.save();

  sendTokenResponse(user, 200, res);
});

// Set cookies on response
const sendTokenResponse = (user, statusCode, res) => {
  const token = user.getSignedJwtToken();

  const currentDate = new Date();
  const cookieExpiration = config.jwt.cookie_expire * 24 * 60 * 60 * 1000;
  const futureDate = new Date(currentDate.getTime() + cookieExpiration);

  const cookieOptions = {
    expires: futureDate,
    httpOnly: true,
    secure: config.node_env === "production",
  };

  res
    .status(statusCode)
    .cookie("token", token, cookieOptions)
    .json({ success: true, token });
};
