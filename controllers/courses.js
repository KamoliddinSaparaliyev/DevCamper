const { asyncHandler } = require("../middleware/async");
const { Course } = require("../models/Course");
const { Bootcamp } = require("../models/Bootcamp");
const { findResourceById } = require("../utils/findModelById");

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
exports.getCourse = asyncHandler(async (req, res, nex) => {
  await findResourceById(Course, req.params.id);

  const course = await Course.findById(req.params.id).populate(
    "bootcamp",
    "name description"
  );

  res.status(200).json({ success: true, data: course });
});

/**
 * @desc Create new courses
 * @route /api/v1/bootcamps/:bootcampId/courses
 * @access Private
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 * @param {import("express").NextFunction} next
 */
exports.postCourse = asyncHandler(async (req, res, nex) => {
  const { bootcampId } = req.params;

  req.body.bootcamp = bootcampId;

  await findResourceById(Bootcamp, bootcampId);

  const course = await Course.create(req.body);

  res.status(201).json({ success: true, data: course });
});

/**
 * @desc Update course
 * @route /api/v1/courses/:id
 * @access Private
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 * @param {import("express").NextFunction} next
 */
exports.updateCourse = asyncHandler(async (req, res, nex) => {
  const { id } = req.params;

  await findResourceById(Course, id);

  const course = await Course.findByIdAndUpdate(id, req.body, {
    new: true,
    runValidators: true,
  });

  res.status(201).json({ success: true, data: course });
});

/**
 * @desc Delet course
 * @route /api/v1/courses/:id
 * @access Private
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 * @param {import("express").NextFunction} next
 */
exports.deleteCourse = asyncHandler(async (req, res, nex) => {
  const { id } = req.params;

  const course = await findResourceById(Course, id);

  await course.deleteOne();

  res.status(200).json({ success: true, data: course });
});
