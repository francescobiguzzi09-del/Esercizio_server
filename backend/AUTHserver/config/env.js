require('dotenv').config();

module.exports = {
    AUTHSERVER_PORT: parseInt(process.env.AUTHSERVER_PORT) || 3500,
    GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID,
    GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET,
    SESSION_SECRET: process.env.SESSION_SECRET || 'your-secret-key',
    FRONTEND_URL: process.env.FRONTEND_URL || 'http://localhost:4000/api/v1/',
    NODE_ENV: process.env.NODE_ENV || 'development',
    JWT_SECRET: process.env.JWT_SECRET || 'default_jwt_secret',
    DB_SERVER_URL: process.env.DB_SERVER_URL || 'http://localhost:3001',
    INTERNAL_API_KEY: process.env.INTERNAL_API_KEY || 'default_internal_api_key',
};