const config = require('dotenv').config();

module.exports = {
  mongoUrl: process.env.MONGO_URL,
  port: process.env.PORT || 3001,
  jwtSecret: process.env.JWT_SECRET || 'default_jwt_secret',
  internalApiKey: process.env.INTERNAL_API_KEY || 'default_internal_api_key',
};