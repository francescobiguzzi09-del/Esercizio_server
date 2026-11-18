const express = require('express');
const router = express.Router();
const { verifyInternalKey } = require('../middlewares/internalAuth');
const { syncGoogleUser } = require('../controllers/userController');

router.post('/internal/users/sync', verifyInternalKey, syncGoogleUser);
module.exports = router;