const asyncHandler = require("express-async-handler");
const { Course } = require("../models/Course");
const { Bootcamp } = require("../models/Bootcamp");
const { findResourceById } = require("../utils/findModelById");

/**
 * @desc Get all courses
 * @route GET /api/v1/courses
 * @route GET /api/v1/bootcamps/:bootcampId/courses
 * @access Public
 */
exports.getCourses = asyncHandler(async (req, res, nex) => {
  if (req.params.bootcampId) {
    const courses = await Course.find({ bootcamp: req.params.bootcampId });
    return res
      .status(200)
      .json({ success: true, count: courses.length, data: courses });
  } else {
    res.status(200).json(res.advancedResults);
  }
});

/**
 * @desc Get one course
 * @route GET /api/v1/courses/:id
 * @access Public
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
 * @route POST /api/v1/bootcamps/:bootcampId/courses
 * @access Private
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
 * @route PATCH /api/v1/courses/:id
 * @access Private
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
 * @route DELETE /api/v1/courses/:id
 * @access Private
 */
exports.deleteCourse = asyncHandler(async (req, res, nex) => {
  const { id } = req.params;

  const course = await findResourceById(Course, id);

  await course.deleteOne();

  res.status(200).json({ success: true, data: course });
});
