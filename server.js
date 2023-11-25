const express = require("express");
const morgan = require("morgan");
const colors = require("colors");

//Routes files
const bootcamps = require("./routes/bootcamps");
const { connectDB } = require("./config/db");

require("dotenv").config({ path: "./config/config.env" });

const app = express();

//DB connection

connectDB();

//Middleware
//Dev logging middleware
if (process.env.NODE_ENV === "development") app.use(morgan("dev"));

//Mount Routes
app.use("/api/v1/bootcamps", bootcamps);

const PORT = process.env.PORT || 5000;

const server = app.listen(
  PORT,
  console.log(
    `Server is running ${process.env.NODE_ENV.bold} mode on port ${PORT.bold}`
      .yellow
  )
);

//Hnadle unhandled promise rejections
process.on("unhandledRejection", (err, promise) => {
  console.log(`Error: ${err.message}`.red);
  //Close server and exit proces
  server.close(() => process.exit(1));
});
