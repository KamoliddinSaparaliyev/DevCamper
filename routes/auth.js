const { protect } = require("../middleware/auth");
const {
  register,
  login,
  getMe,
  forgetPassword,
  resetPassword,
  updateDetails,
  updatePassword,
  logout,
} = require("../controllers/auth");

const router = require("express").Router();

router.post("/register", register);
router.post("/login", login);
router.get("/logout", logout);
router.get("/me", protect, getMe);
router.post("/forgetpassword", forgetPassword);
router.put("/resetpassword/:resettoken", resetPassword);
router.put("/updatedetails", protect, updateDetails);
router.put("/updatepassword", protect, updatePassword);

module.exports = router;
