const express = require('express');
const router = express.Router();
const passport = require('../../config/passport');
const config = require('../../config/env');
router.get('/google', passport.authenticate('google', {
  scope: ['profile', 'email'],
  prompt: 'select_account'
}));

router.get('/google/callback',
  passport.authenticate('google', { failureRedirect: config.FRONTEND_URL }),
  (req, res) => {
    const name = req.user?.displayName || req.user?.name || 'Utente';
    res.redirect(config.FRONTEND_URL + `?name=${encodeURIComponent(name)}`);
  }
);

router.get('/me', (req, res) => {
  res.set("Cache-Control", "no-store");
  if(!req.isAuthenticated()) {
    return res.json({ authenticated: false});
  }
  res.json({
    authenticated: true,
    firstName: req.user.firstName,
  });
});

router.get('/logout', (req, res) => {
  req.logout((err) => {
    if (err) return next(err);
    req.session.destroy(() => {
      res.clearCookie('connect.sid');
      res.redirect(config.FRONTEND_URL);
    });
  });
});

module.exports = router;
