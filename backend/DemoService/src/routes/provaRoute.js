const express = require('express');
const path = require('path');
const router = express.Router();
const { getProva } = require('../controllers/provaController');

router.get('/prova', getProva);

module.exports = router;