const {
  getBootcamps,
  postBootcamp,
  getBootcamp,
  updateBootcamp,
  deleteBootcamp,
} = require("../controllers/bootcamps");

const router = require("express").Router();

router.route("/").get(getBootcamps).post(postBootcamp);
router
  .route("/:id")
  .get(getBootcamp)
  .patch(updateBootcamp)
  .delete(deleteBootcamp);

module.exports = router;
