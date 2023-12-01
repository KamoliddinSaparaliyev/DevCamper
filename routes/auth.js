const {
  register,
  login,
  getMe,
  forgetPassword,
  getAll,
  resetPassword,
} = require("../controllers/auth");
const { protect, authorize } = require("../middleware/auth");

const router = require("express").Router();

router.route("/register").post(register);

router.route("/login").post(login);

router.route("/me").get(protect, authorize("publisher", "user"), getMe);

router.route("/forgetpassword").post(forgetPassword);

router.route("/resetpassword/:resettoken").put(resetPassword);

router.get("/", getAll);

module.exports = router;
