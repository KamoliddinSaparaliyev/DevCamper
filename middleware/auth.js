const jwt = require("jsonwebtoken");
const asyncHandler = require("express-async-handler");
const { config } = require("../config/config");
const { ErrorResponse } = require("../utils/errorResponse");
const { User } = require("../models/User");

exports.protect = asyncHandler(async (req, res, next) => {
  let token;
  // Check for Authorization header
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    // Set token from header
    token = req.headers.authorization.split(" ")[1];
  }
  //Set token from cookie
  //   else if (req.cookies.token) {
  //     token = req.cookies.token;
  //   }

  if (!token) {
    throw new ErrorResponse("Not authorized to access this route", 401);
  }

  // Verify token
  try {
    const decoded = jwt.verify(token, config.jwt.secret);

    // Find user from database using the decoded user ID
    const user = await User.findById(decoded.user.id);

    // Check if user exists
    if (!user) throw new ErrorResponse("User not found", 404);

    // Set user in request object for use in subsequent middleware
    req.user = user;
    next();
  } catch (err) {
    throw new ErrorResponse("Invalid token", 401);
  }
});

exports.authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role))
      throw new ErrorResponse(
        `User role ${req.user.role} is not authorized to access this route`,
        403
      );

    next();
  };
};
