const express = require('express');
const { connectToMongoDB, disconnectFromMongoDB } = require('./config/connection');
const router = express.Router();
const saveData = require('../controllers/saveDataController');

router.post('/save-data/:collection', saveData);

module.exports = router;