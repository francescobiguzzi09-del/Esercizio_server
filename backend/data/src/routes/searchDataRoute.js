const express = require('express');
const router = express.Router();
const {searchData} = require('../controllers/searchDataController');
const {authMiddleware} = require('../middlewares/authMiddleware');

router.post('/search-data/:collection', authMiddleware, searchData);

module.exports = router;