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
};

module.exports = { config };
