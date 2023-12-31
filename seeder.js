const fs = require("fs");
const mongoose = require("mongoose");
require("colors");
const { config } = require("./config/config");
const { Bootcamp } = require("./models/Bootcamp");
const { Course } = require("./models/Course");
const { User } = require("./models/User");
const { Review } = require("./models/Review");

const connectDB = async () => {
  try {
    await mongoose.connect(config.mongo_uri);
    console.log("MongoDB Connected...".cyan);
  } catch (error) {
    console.error(`MongoDB Connection Error: ${error.message}`.red);
    process.exit(1);
  }
};

const bootcamps = JSON.parse(
  fs.readFileSync(__dirname + "/_data/bootcamps.json", "utf-8")
);

const courses = JSON.parse(
  fs.readFileSync(__dirname + "/_data/courses.json", "utf-8")
);

const users = JSON.parse(
  fs.readFileSync(__dirname + "/_data/users.json", "utf-8")
);

const reviews = JSON.parse(
  fs.readFileSync(__dirname + "/_data/reviews.json", "utf-8")
);

const importData = async () => {
  try {
    await Bootcamp.create(bootcamps);
    await Course.create(courses);
    await User.create(users);
    await Review.create(reviews);

    console.log("Data imported...".green.inverse);
    process.exit();
  } catch (error) {
    console.error(`Error importing data: ${error.message}`.red);
    process.exit(1);
  }
};

const deleteData = async () => {
  try {
    await Bootcamp.deleteMany();
    await Course.deleteMany();
    await User.deleteMany();
    await Review.deleteMany();

    console.log("Data destroyed...".red.inverse);
    process.exit();
  } catch (error) {
    console.error(`Error deleting data: ${error.message}`.red);
    process.exit(1);
  }
};

const seedDatabase = async () => {
  if (process.argv[2] === "-i") {
    await connectDB();
    await importData();
  }
  if (process.argv[2] === "-d") {
    await connectDB();
    await deleteData();
  }
};

seedDatabase();
