const express = require('express');
const router = express.Router();
const passport = require('../../config/passport');

router.get(
  "/google",
  passport.authenticate("google", {
    scope: ["profile", "email"],
    prompt: "select_account",
  })
);

router.get(
  "/google/callback",
  passport.authenticate("google", {
    failureRedirect: "/login",
  }),
  (req, res) => {
    const name = req.user?.displayName || req.user?.name || "utente";
    const redirectUrl = "http://localhost:4000/api/v1/?googleuser=" + encodeURIComponent(name);
    return res.redirect(redirectUrl);
  }
);

module.exports = router;