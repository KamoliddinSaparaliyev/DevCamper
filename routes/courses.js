const {
  getCourses,
  postCourse,
  getCourse,
  updateCourse,
  deleteCourse,
} = require("../controllers/courses");

const router = require("express").Router({ mergeParams: true });

router.route("/").get(getCourses).post(postCourse);
router.route("/:id").get(getCourse).patch(updateCourse).delete(deleteCourse);

module.exports = router;
