const express = require('express');
const { connectToMongoDB, disconnectFromMongoDB } = require('./config/connection');
const router = express.Router();
const saveData = require('../controllers/saveDataController');

router.post('/save-data', saveData);

module.exports = router;