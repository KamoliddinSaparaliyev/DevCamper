const { ErrorResponse } = require("../utils/errorResponse");

const errorHandler = (err, req, res, next) => {
  let error = { ...err }; // Create a shallow copy of the error object

  if (process.env.NODE_ENV === "development") {
    console.error(err.stack.red);
  }

  error.message = err.message;

  if (err.name === "CastError") {
    error = new ErrorResponse(
      `Resource not found with id of ${err.value}`,
      404
    );
  } else if (err.code === 11000) {
    error = new ErrorResponse("Duplicate field entered", 400);
  } else if (err.name === "ValidationError") {
    error = new ErrorResponse(
      Object.values(err.errors).map((e) => e.message),
      400
    );
  } else if (err.name === "JsonWebTokenError") {
    err = new ErrorResponse("Invalid token", 401);
  }

  res.status(error.statusCode || 500).json({
    success: false,
    error: error.message || "Internal Server Error",
  });
};

module.exports = { errorHandler };
