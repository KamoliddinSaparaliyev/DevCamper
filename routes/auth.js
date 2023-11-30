const { register, login, getMe } = require("../controllers/auth");
const { protect, authorize } = require("../middleware/auth");

const router = require("express").Router();

router.route("/register").post(register);

router.route("/login").post(login);

router.route("/me").get(protect, authorize("publisher", "user"), getMe);

module.exports = router;
