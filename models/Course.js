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

// Static method to get avg of course tuitions
CourseSchema.statics.calculateAverageCost = async function (bootcampId) {
  try {
    const aggregateResult = await this.aggregate([
      {
        $match: { bootcamp: bootcampId },
      },
      {
        $group: {
          _id: "$bootcamp",
          averageCost: { $avg: "$tuition" },
        },
      },
    ]);

    const averageCost =
      aggregateResult.length > 0 ? aggregateResult[0].averageCost : 0;

    const result = await this.model("Bootcamp").findByIdAndUpdate(
      bootcampId,
      {
        averageCost: Math.ceil(averageCost * 10) / 10,
      },
      { new: true }
    );
  } catch (error) {
    console.error(`Error calculating average cost: ${error}`);
    throw new Error(`Error calculating average cost: ${error}`);
  }
};

CourseSchema.post("save", async function () {
  await this.constructor.calculateAverageCost(this.bootcamp);
});

CourseSchema.pre("deleteOne", { document: true }, async function () {
  await this.constructor.calculateAverageCost(this.bootcamp);
});

const Course = mongoose.model("Course", CourseSchema);

module.exports = { Course };
