const express = require("express");
const morgan = require("morgan");

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

app.listen(
  PORT,
  console.log(`Server is running ${process.env.NODE_ENV} mode on port ${PORT}`)
);
