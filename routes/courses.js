const {
  getCourses,
  postCourse,
  getCourse,
  updateCourse,
  deleteCourse,
} = require("../controllers/courses");
const { advancedResults } = require("../middleware/advancedRestults");
const { protect } = require("../middleware/auth");
const { Course } = require("../models/Course");

const router = require("express").Router({ mergeParams: true });

router
  .route("/")
  .get(
    advancedResults(Course, { path: "bootcamp", select: "name description" }),
    getCourses
  )
  .post(protect, postCourse);
router
  .route("/:id")
  .get(getCourse)
  .patch(protect, updateCourse)
  .delete(protect, deleteCourse);

module.exports = router;
