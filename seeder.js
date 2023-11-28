const fs = require("fs");
const mongoose = require("mongoose");
require("colors");
const { config } = require("./config/config");
const { Bootcamp } = require("./models/Bootcamp");
const { Course } = require("./models/Course");

const connectDB = async () => {
  try {
    await mongoose.connect(config.mongo_uri);
    console.log("MongoDB Connected...".cyan);
  } catch (error) {
    console.error(`MongoDB Connection Error: ${error.message}`.red);
    process.exit(1);
  }
};

const importData = async () => {
  try {
    await Bootcamp.create(
      JSON.parse(fs.readFileSync(__dirname + "/_data/bootcamps.json", "utf-8"))
    );

    await Course.create(
      JSON.parse(fs.readFileSync(__dirname + "/_data/courses.json", "utf-8"))
    );

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
