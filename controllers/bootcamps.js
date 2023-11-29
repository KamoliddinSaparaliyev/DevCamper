const { asyncHandler } = require("../middleware/async");
const { Bootcamp } = require("../models/Bootcamp");
const { ErrorResponse } = require("../utils/errorResponse");
const { geocoder } = require("../utils/geocoder");

/**
 * @desc Get all bootcamps
 * @route /api/v1/bootcamps
 * @access Public
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 * @param {import("express").NextFunction} next
 */
exports.getBootcamps = asyncHandler(async (req, res, next) => {
  const reqQuery = { ...req.query };

  // Extract fields to remove from query
  const removeFields = ["select", "sort", "page", "limit"];

  // Remove fields from reqQuery
  removeFields.forEach((param) => delete reqQuery[param]);

  // Convert query object to string to manipulate
  let queryStr = JSON.stringify(reqQuery);

  // Add MongoDB operators ($gt, $gte, etc.) to query string
  queryStr = queryStr.replace(
    /\b(gt|gte|lt|lte|in)\b/g,
    (match) => `$${match}`
  );

  // Parse the modified query string back to an object
  let query = Bootcamp.find(JSON.parse(queryStr));

  // Select specific fields if specified in query
  if (req.query.select) {
    const fields = req.query.select.split(",").join(" ");
    query = query.select(fields);
  }

  // Sort
  if (req.query.sort) {
    const sortBy = req.query.sort.split(",").join(" ");
    query = query.sort(sortBy);
  } else {
    query = query.sort("-createdAt");
  }

  // Pagination
  const page = parseInt(req.query.page, 10) || 1;
  const limit = parseInt(req.query.limit, 10) || 1;
  const startIndex = (page - 1) * limit;
  const endIndex = page * limit;
  const total = await Bootcamp.countDocuments();

  query = query.skip(startIndex).limit(limit);

  // Execute the query
  const data = await query.populate("courses");

  // Pagination result
  const pagination = {};

  if (endIndex < total) {
    pagination.next = {
      page: page + 1,
      limit,
    };
  }

  if (startIndex > 0) {
    pagination.prev = {
      page: page - 1,
      limit,
    };
  }

  res.status(200).json({ success: true, count: data.length, pagination, data });
});

/**
 * @desc Get one bootcamp
 * @route /api/v1/bootcamps/:id
 * @access Public
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 * @param {import("express").NextFunction} next
 */
exports.getBootcamp = asyncHandler(async (req, res, next) => {
  const data = await Bootcamp.findById(req.params.id);

  if (!data)
    throw new ErrorResponse(
      `Resource not found with id of ${req.params.id}`,
      404
    );

  res.status(200).json({ success: true, data });
});

/**
 * @desc Create new bootcamp
 * @route /api/v1/bootcamps
 * @access Private
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 * @param {import("express").NextFunction} next
 */
exports.postBootcamp = asyncHandler(async (req, res, next) => {
  const data = await Bootcamp.create(req.body);

  res.status(201).json({ success: true, data });
});

/**
 * @desc Update  bootcamp
 * @route /api/v1/bootcamps/:id
 * @access Private
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 * @param {import("express").NextFunction} next
 */
exports.updateBootcamp = asyncHandler(async (req, res, next) => {
  const exisist = await Bootcamp.findById(req.params.id);

  if (!exisist)
    throw new ErrorResponse(
      `Resource not found with id of ${req.params.id}`,
      404
    );

  const data = await Bootcamp.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({ success: true, data });
});

/**
 * @desc Delete bootcamp
 * @route /api/v1/bootcamps/:id
 * @access Private
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 * @param {import("express").NextFunction} next
 */
exports.deleteBootcamp = asyncHandler(async (req, res, next) => {
  const bootcamp = await Bootcamp.findById(req.params.id);

  if (!bootcamp) {
    throw new ErrorResponse(
      `Resource not found with id of ${req.params.id}`,
      404
    );
  }
  const result = await bootcamp.deleteOne();
  console.log(result);
  res.status(200).json({ success: true, data: {} });
});

/**
 * @desc Get one bootcamp wiht zipcode and distance
 * @route /api/v1/bootcamps/radius/:zipcode/:distance
 * @access Public
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 * @param {import("express").NextFunction} next
 */
exports.getBootcampInRadius = asyncHandler(async (req, res, next) => {
  const { zipcode, distance } = req.params;
  const loc = await geocoder.geocode(zipcode);
  const lng = loc[0].longitude;
  const lat = loc[0].latitude;

  const radius = distance / 3978;

  const bootcamps = await Bootcamp.find({
    location: {
      $geoWithin: { $centerSphere: [[lng, lat], radius] },
    },
  });
  res
    .status(200)
    .json({ success: true, data: bootcamps, count: bootcamps.length });
});
