const path = require("path");
const express = require("express");
const morgan = require("morgan");
const colors = require("colors");
const cookieParser = require("cookie-parser");
const mongoSanitize = require("express-mongo-sanitize");
const helmet = require("helmet");
const xss = require("xss-clean");
const rateLimit = require("express-mongo-sanitize");
const hpp = require("hpp");
const cors = require("cors");
const { connectDB } = require("./config/db");
const { errorHandler } = require("./middleware/error");
const { config } = require("./config/config");

//Routes files
const bootcamps = require("./routes/bootcamps");
const courses = require("./routes/courses");
const auth = require("./routes/auth");
const users = require("./routes/users");
const reviews = require("./routes/reviews");

// DB connection
connectDB();

const app = express();

// JSON parse
app.use(express.json());

// Middleware
// Dev logging middleware
if (config.node_env === "development") app.use(morgan("dev"));

// Cookie parser
app.use(cookieParser());

// Sanitize
app.use(mongoSanitize());

// Helmet
app.use(helmet());

// Prevent Xss Attacks
app.use(xss());

// Rate limiting
const limiter = rateLimit({ windowMs: 10 * 10 * 1000, max: 100 });

app.use(limiter);

// Prevent http param pollution
app.use(hpp());

// Enable cors
app.use(cors());

// Set static folder
app.use(express.static(path.join(__dirname, "public")));

//Mount Routes
app.use("/api/v1/bootcamps", bootcamps);
app.use("/api/v1/courses", courses);
app.use("/api/v1/auth", auth);
app.use("/api/v1/users", users);
app.use("/api/v1/reviews", reviews);

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
