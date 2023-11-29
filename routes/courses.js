const {
  getCourses,
  postCourse,
  getCourse,
  updateCourse,
  deleteCourse,
} = require("../controllers/courses");
const { advancedResults } = require("../middleware/advancedRestults");
const { Course } = require("../models/Course");

const router = require("express").Router({ mergeParams: true });

router
  .route("/")
  .get(
    advancedResults(Course, { path: "bootcamp", select: "name description" }),
    getCourses
  )
  .post(postCourse);
router.route("/:id").get(getCourse).patch(updateCourse).delete(deleteCourse);

module.exports = router;
