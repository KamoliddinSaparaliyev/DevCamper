const {
  getBootcamps,
  postBootcamp,
  getBootcamp,
  updateBootcamp,
  deleteBootcamp,
  getBootcampInRadius,
  bootcampPhotoUpload,
} = require("../controllers/bootcamps");
const { advancedResults } = require("../middleware/advancedRestults");
const { Bootcamp } = require("../models/Bootcamp");
const { upload } = require("../utils/multer");

// Include other resource routers
const courseRouter = require("./courses");

const router = require("express").Router();

// Re-route into other resource routers
router.use("/:bootcampId/courses", courseRouter);

router.route("/:id/photo").put(upload.single("file"), bootcampPhotoUpload);

router.route("/radius/:zipcode/:distance").get(getBootcampInRadius);

router
  .route("/")
  .get(advancedResults(Bootcamp, "courses"), getBootcamps)
  .post(postBootcamp);

router
  .route("/:id")
  .get(getBootcamp)
  .patch(updateBootcamp)
  .delete(deleteBootcamp);

module.exports = router;
