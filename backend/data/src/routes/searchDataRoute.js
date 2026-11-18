const express = require('express');
const router = express.Router();
const searchDataController = require('../controllers/searchDataController');

router.post('/search-data/:collection', searchDataController);

module.exports = router;