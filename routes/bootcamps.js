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
const { protect } = require("../middleware/auth");
const { Bootcamp } = require("../models/Bootcamp");
const { upload } = require("../utils/multer");

// Include other resource routers
const courseRouter = require("./courses");

const router = require("express").Router();

// Re-route into other resource routers
router.use("/:bootcampId/courses", courseRouter);

router
  .route("/:id/photo")
  .put(protect, upload.single("file"), bootcampPhotoUpload);

router.route("/radius/:zipcode/:distance").get(getBootcampInRadius);

router
  .route("/")
  .get(advancedResults(Bootcamp, "courses"), getBootcamps)
  .post(protect, postBootcamp);

router
  .route("/:id")
  .get(getBootcamp)
  .patch(protect, updateBootcamp)
  .delete(protect, deleteBootcamp);

module.exports = router;
