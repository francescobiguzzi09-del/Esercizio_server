const express = require('express');
const router = express.Router();
const searchDataController = require('../controllers/searchDataController');

router.post('/search-data', searchDataController);

module.exports = router;