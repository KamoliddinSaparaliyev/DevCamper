const mongoose = require("mongoose");

const CourseSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      trim: true,
      required: [true, "Please add a course title"],
    },
    description: {
      type: String,
      required: [true, "Please add a description"],
    },
    weeks: {
      type: String,
      required: [true, "Please add a number of week"],
    },
    tuition: {
      type: Number,
      required: [true, "Please add a tution cost"],
    },
    minimumSkill: {
      type: String,
      required: [true, "Please add a skill"],
      enum: ["beginner", "intermediate", "advenced"],
    },
    scholarshipAvailable: {
      type: Boolean,
      default: false,
    },
    bootcamp: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Bootcamp",
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

const Course = mongoose.model("Course", CourseSchema);

module.exports = { Course };
