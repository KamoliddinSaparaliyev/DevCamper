const path = require("path");
const express = require("express");
const morgan = require("morgan");
const colors = require("colors");
const cookieParser = require("cookie-parser");
const { connectDB } = require("./config/db");
const { errorHandler } = require("./middleware/error");
const { config } = require("./config/config");

//Routes files
const bootcamps = require("./routes/bootcamps");
const courses = require("./routes/courses");
const auth = require("./routes/auth");

// DB connection
connectDB();

const app = express();

// JSON parse
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

// Cookie parser
app.use(cookieParser());

//Middleware
//Dev logging middleware
if (config.node_env === "development") app.use(morgan("dev"));

//Mount Routes
app.use("/api/v1/bootcamps", bootcamps);
app.use("/api/v1/courses", courses);
app.use("/api/v1/auth", auth);

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
