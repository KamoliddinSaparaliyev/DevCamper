const { asyncHandler } = require("../middleware/async");
const { Bootcamp } = require("../models/Bootcamp");
const { ErrorResponse } = require("../utils/errorResponse");

/**
 * @desc Get all bootcamps
 * @route /api/v1/bootcamps
 * @access Public
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 * @param {import("express").NextFunction} next
 */
exports.getBootcamps = asyncHandler(async (req, res, next) => {
  const data = await Bootcamp.find();

  res.status(201).json({ success: true, data });
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
  const exisist = await Bootcamp.findById(req.params.id);

  if (!exisist)
    throw new ErrorResponse(
      `Resource not found with id of ${req.params.id}`,
      404
    );

  const data = await Bootcamp.findByIdAndDelete(req.params.id);

  res.status(200).json({ success: true, data });
});
