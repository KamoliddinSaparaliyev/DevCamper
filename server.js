const express = require("express");
const morgan = require("morgan");
require("colors");
const { connectDB } = require("./config/db");
const { errorHandler } = require("./middleware/error");

//Routes files
const bootcamps = require("./routes/bootcamps");
const { config } = require("./config/config");

//DB connection
connectDB();

const app = express();

//JSON parse
app.use(express.json());

//Middleware
//Dev logging middleware
if (config.node_env === "development") app.use(morgan("dev"));

//Mount Routes
app.use("/api/v1/bootcamps", bootcamps);

//Error handling
app.use(errorHandler);

const PORT = config.port || 5000;

const server = app.listen(
  PORT,
  console.log(
    `Server is running ${config.node_env.bold} mode on port ${PORT.bold}`.yellow
  )
);

//Hnadle unhandled promise rejections
process.on("unhandledRejection", (err, promise) => {
  console.log(`Error: ${err.message}`.red);
  //Close server and exit proces
  server.close(() => process.exit(1));
});
