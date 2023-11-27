const mongoose = require("mongoose");
const { config } = require("./config");

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(config.mongo_uri);

    console.log(
      `MongoDB connected: ${conn.connection.host.underline.bold}`.cyan
    );
  } catch (err) {
    console.error(`Error connecting to MongoDB: ${err.message}`.red);
    process.exit(1);
  }
};

module.exports = { connectDB };
