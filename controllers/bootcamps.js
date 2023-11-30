const asyncHandler = require("express-async-handler");
const { Bootcamp } = require("../models/Bootcamp");
const { ErrorResponse } = require("../utils/errorResponse");
const { findResourceById } = require("../utils/findModelById");
const { geocoder } = require("../utils/geocoder");

/**
 * @desc Get all bootcamps
 * @route GET /api/v1/bootcamps
 * @access Public
 */
exports.getBootcamps = asyncHandler(async (req, res, next) => {
  res.status(200).json(res.advancedResults);
});

/**
 * @desc Get one bootcamp
 * @route GET /api/v1/bootcamps/:id
 * @access Public
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
 * @route POST /api/v1/bootcamps
 * @access Private
 */
exports.postBootcamp = asyncHandler(async (req, res, next) => {
  const data = await Bootcamp.create(req.body);

  res.status(201).json({ success: true, data });
});

/**
 * @desc Update  bootcamp
 * @route PATCH /api/v1/bootcamps/:id
 * @access Private
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
 * @route DELETE /api/v1/bootcamps/:id
 * @access Private
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
 * @route GET /api/v1/bootcamps/radius/:zipcode/:distance
 * @access Public
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

/**
 * @desc Upload file for bootcamp
 * @route PUT /api/v1/bootcamps/:id/photo
 * @access Private
 */
exports.bootcampPhotoUpload = asyncHandler(async (req, res, next) => {
  const { id } = req.params;

  await findResourceById(Bootcamp, id);

  if (!req.file) throw new ErrorResponse("Please upload a file", 400);

  await Bootcamp.findByIdAndUpdate(
    id,
    {
      photo: req.file.filename,
    },
    { new: true }
  );

  res.status(200).json({ success: true, data: req.file.filename });
});
