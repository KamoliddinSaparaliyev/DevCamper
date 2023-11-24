const {
  getBootcamps,
  postBootcamp,
  getBootcamp,
  patchBootcamp,
  deleteBootcamp,
} = require("../controllers/bootcamps");

const router = require("express").Router();

router.route("/").get(getBootcamps).post(postBootcamp);
router
  .route("/:id")
  .get(getBootcamp)
  .patch(patchBootcamp)
  .delete(deleteBootcamp);

module.exports = router;
