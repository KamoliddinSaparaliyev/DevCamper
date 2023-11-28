const {
  getBootcamps,
  postBootcamp,
  getBootcamp,
  updateBootcamp,
  deleteBootcamp,
  getBootcampInRadius,
} = require("../controllers/bootcamps");

const router = require("express").Router();

router.route("/radius/:zipcode/:distance").get(getBootcampInRadius);
router.route("/").get(getBootcamps).post(postBootcamp);
router
  .route("/:id")
  .get(getBootcamp)
  .patch(updateBootcamp)
  .delete(deleteBootcamp);

module.exports = router;
