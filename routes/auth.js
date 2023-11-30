const { register } = require("../controllers/auth");

const router = require("express").Router({ mergeParams: true });

router.route("/register").post(register);

module.exports = router;
