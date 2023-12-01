const mongoose = require("mongoose");

const ReviewSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      trim: true,
      required: [true, "Please add a rewiev title"],
    },
    text: {
      type: String,
      required: [true, "Please enter some text"],
    },
    rating: {
      type: Number,
      required: [true, "Please add a number from 1 to 10 "],
      min: 1,
      max: 10,
    },
    bootcamp: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Bootcamp",
      required: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: {
      createdAt: true,
      updatedAt: false,
    },
  }
);

const Review = mongoose.model("Review", ReviewSchema);

module.exports = { Review };
