const { asyncHandler } = require("../middleware/async");
const { ErrorResponse } = require("../utils/errorResponse");
const { Course } = require("../models/Course");

/**
 * @desc Get all courses
 * @route /api/v1/courses
 * @route /api/v1/bootcamps/:bootcampId/courses
 * @access Public
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 * @param {import("express").NextFunction} next
 */
exports.getCourses = asyncHandler(async (req, res, nex) => {
  let query;
  if (req.params.bootcampId) {
    query = Course.find({ bootcamp: req.params.bootcampId });
  } else {
    query = Course.find();
  }
  const courses = await query;

  res.status(200).json({ success: true, count: courses.length, data: courses });
});

/**
 * @desc Get one course
 * @route /api/v1/courses/:id
 * @access Public
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 * @param {import("express").NextFunction} next
 */
exports.getCourse = asyncHandler(async (req, res, nex) => {});
/**
 * @desc Create new courses
 * @route /api/v1/courses
 * @access Private
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 * @param {import("express").NextFunction} next
 */
exports.postCourse = asyncHandler(async (req, res, nex) => {});
/**
 * @desc Update course
 * @route /api/v1/courses/:id
 * @access Private
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 * @param {import("express").NextFunction} next
 */
exports.updateCourse = asyncHandler(async (req, res, nex) => {});
/**
 * @desc Delet course
 * @route /api/v1/courses/:id
 * @access Private
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 * @param {import("express").NextFunction} next
 */
exports.deleteCourse = asyncHandler(async (req, res, nex) => {});
