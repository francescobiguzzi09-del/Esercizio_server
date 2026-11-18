const express = require('express');
const router = express.Router();
const {saveData} = require('../controllers/saveDataController');
const {authMiddleware} = require('../middlewares/authMiddleware');

router.post('/save-data/:collection', authMiddleware, saveData);

module.exports = router;