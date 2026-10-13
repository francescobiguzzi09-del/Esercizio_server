const express = require('express');
const router = express.Router();
const paths = require('../../config/paths');
const { authController } = require(paths.AUTH_CONTROLLER);

router.post('/login', authController);

module.exports = router;