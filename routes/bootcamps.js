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
const { protect, authorize } = require("../middleware/auth");
const { Bootcamp } = require("../models/Bootcamp");
const { upload } = require("../utils/multer");

// Include other resource routers
const courseRouter = require("./courses");
const reviewRouter = require("./reviews");

const router = require("express").Router();

// Re-route into other resource routers
router.use("/:bootcampId/courses", courseRouter);
router.use("/:bootcampId/reviews", reviewRouter);

router
  .route("/:id/photo")
  .put(
    protect,
    authorize("publisher"),
    upload.single("file"),
    bootcampPhotoUpload
  );

router.route("/radius/:zipcode/:distance").get(getBootcampInRadius);

router
  .route("/")
  .get(advancedResults(Bootcamp, "courses"), getBootcamps)
  .post(protect, authorize("publisher"), postBootcamp);

router
  .route("/:id")
  .get(getBootcamp)
  .patch(protect, authorize("publisher"), updateBootcamp)
  .delete(protect, authorize("publisher"), deleteBootcamp);

module.exports = router;
