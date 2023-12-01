const asyncHandler = require("express-async-handler");
const { ErrorResponse } = require("../utils/errorResponse");
const { Review } = require("../models/Review");
const { Bootcamp } = require("../models/Bootcamp");
const { findResourceById } = require("../utils/findModelById");

/**
 * @desc Get all reviews
 * @route GET /api/v1/reviews
 * @route GET /api/v1/bootcamps/:bootcampId/reviews
 * @access Public
 */
exports.getReviews = asyncHandler(async (req, res, nex) => {
  if (req.params.bootcampId) {
    const reviews = await Review.find({ bootcamp: req.params.bootcampId });

    return res
      .status(200)
      .json({ success: true, count: reviews.length, data: reviews });
  } else {
    res.status(200).json(res.advancedResults);
  }
});

/**
 * @desc Get single reviews
 * @route GET /api/v1/reviews:id
 * @access Public
 */
exports.getReview = asyncHandler(async (req, res, nex) => {
  const review = await Review.findById(req.params.id).populate(
    "bootcamp",
    "name description"
  );

  if (!review)
    throw new ErrorResponse(
      `No review found with the id of ${req.params.id}`,
      404
    );

  res.status(200).json({ success: true, data: review });
});

/**
 * @desc Create review
 * @route POST /api/v1/bootcamps/:bootcampId/reviews
 * @access Private
 */
exports.addReview = asyncHandler(async (req, res, nex) => {
  const { bootcampId } = req.params;
  const { id } = req.user;

  req.body.bootcamp = bootcampId;
  req.body.user = id;

  const addedReviews = await Review.findOne({
    user: id,
    bootcamp: bootcampId,
  });

  await findResourceById(Bootcamp, bootcampId);

  // If the user is not an admin, they can only one bootcamp
  if (addedReviews)
    throw new ErrorResponse(
      `The user with ID ${id} has already add a review`,
      400
    );

  const review = await Review.create(req.body);

  res.status(200).json({ success: true, data: review });
});
