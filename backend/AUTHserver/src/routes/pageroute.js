const express = require('express');
const router = express.Router();
const path = require('path');
const paths = require('../../config/paths');

router.get('/login', (req, res) => {
    res.sendFile(path.join(paths.PUBLIC, 'login.html'));
});

module.exports = router;