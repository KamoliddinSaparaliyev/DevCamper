const crypto = require("crypto");
const mongoose = require("mongoose");
const { genSalt, hash, compare } = require("bcryptjs");
const { sign } = require("jsonwebtoken");
const { config } = require("../config/config");

const UserSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Please add a name"],
    },
    email: {
      type: String,
      required: [true, "Please add a email"],
      unique: true,
      match: [
        /^([a-zA-Z0-9_\-\.]+)@([a-zA-Z0-9_\-]+)(\.[a-zA-Z]{2,5}){1,2}$/,
        "Please add a valid emil",
      ],
    },
    role: { type: String, enum: ["user", "publisher"], default: "user" },
    password: {
      type: String,
      required: [true, "Please add a password"],
      minlenght: 6,
      select: false,
    },
    resetPasswordToken: String,
    resetPasswordExpire: Date,
  },
  {
    timestamps: {
      createdAt: true,
      updatedAt: false,
    },
  }
);

// Hashing password
UserSchema.pre("save", async function (next) {
  if (!this.isModified("password")) next();

  const salt = await genSalt(10);

  this.password = await hash(this.password, salt);
});

// Sign JWT token and return
UserSchema.methods.getSignedJwtToken = function () {
  return sign({ user: { id: this._id } }, config.jwt.secret, {
    expiresIn: config.jwt.expire,
  });
};

// Compare password
UserSchema.methods.matchPassword = async function (enteredPassword) {
  return await compare(enteredPassword, this.password);
};

// Assuming UserSchema is defined correctly...
UserSchema.methods.getResetPasswordToken = function () {
  const resetToken = crypto.randomBytes(20).toString("hex");

  // Hash token and set resetPasswordToken field on the instance
  this.resetPasswordToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");

  // Set the expiration time for the reset token
  this.resetPasswordExpire = Date.now() + 10 * 60 * 1000; // 10 minutes in milliseconds

  // Save the changes made to the user document
  this.save({ validateBeforeSave: false });

  return resetToken;
};

module.exports.User = mongoose.model("User", UserSchema);
