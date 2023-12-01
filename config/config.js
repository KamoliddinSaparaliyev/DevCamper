const path = require("path");
const dotenv = require("dotenv");

const envPath = path.join(__dirname, "config.env");

dotenv.config({ path: envPath });

const config = {
  port: process.env.PORT,
  mongo_uri: process.env.MONGO_URI,
  node_env: process.env.NODE_ENV,
  geocoder: {
    provider: process.env.GEOCODER_PROVIDER,
    apiKey: process.env.GEOCODER_API_KEY,
  },
  jwt: {
    secret: process.env.JWT_SECRET,
    expire: process.env.JWT_EXPIRE,
    cookie_expire: process.env.JWT_COOKIE_EXPIRE,
  },
  smtp: {
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    email: process.env.SMTP_EAMIL,
    password: process.env.SMTP_PASSWORD,
    from_email: process.env.FROM_EMAIL,
    from_name: process.env.FROM_NAME,
  },
};

module.exports = { config };
