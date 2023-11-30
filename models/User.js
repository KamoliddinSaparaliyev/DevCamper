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

module.exports.User = mongoose.model("User", UserSchema);
