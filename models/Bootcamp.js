const mongoose = require("mongoose");

const BootcampSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      requireq: [true, "Please add a name"],
      uniqe: true,
      trim: true,
      maxLength: [50, "Name can not be more then 50 characters"],
    },
    slug: String,
    description: {
      type: String,
      requireq: [true, "Please add a description"],
      maxLength: [500, "Description can not be more then 500 characters"],
    },
    website: {
      type: String,
      match: [
        /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/,
        "Please use a valid URL with HTTP or HTTPS",
      ],
    },
    phone: {
      type: String,
      match: [
        /(^(\+88|0088|88)?(01){1}[3456789]{1}(\d){8})$/,
        "Please enter phone number",
      ],
      maxLength: [20, "Phone number can not be long than 20 characters"],
    },
    email: {
      type: String,
      match: [
        /^([a-zA-Z0-9_\-\.]+)@([a-zA-Z0-9_\-]+)(\.[a-zA-Z]{2,5}){1,2}$/,
        "Please add a valid emil",
      ],
    },
    location: {
      type: {
        type: String,
        enum: ["Point"],
        required: true,
      },
      coordinates: {
        type: [Number],
        required: true,
        index: "2dsphere",
      },
      formattedAddress: String,
      street: String,
      city: String,
      state: String,
      zipcode: String,
      country: String,
    },
    carerrs: {
      type: String,
      required: true,
      enum: [
        "Web Development",
        "Mobile Development",
        "UI/UX",
        "Data Science",
        "Business",
        "Other",
      ],
    },
    averageRating: {
      type: Number,
      min: [1, "Rating must be at least 1"],
      max: [10, "Rating must can not be more than 10"],
    },
    averageCost: Number,
    photo: { type: String, default: "no-photo.jpg" },
    housing: {
      type: Boolean,
      default: false,
    },
    jobAssistance: {
      type: Boolean,
      default: false,
    },
    jobGuarante: {
      type: Boolean,
      default: false,
    },
    acceptGi: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: {
      createdAt: true,
      updatedAt: false,
    },
  }
);

const Bootcamp = mongoose.model("Bootcamp", BootcampSchema);

module.exports = { Bootcamp };
