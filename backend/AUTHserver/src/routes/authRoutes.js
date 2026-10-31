const express = require('express');
const router = express.Router();
const passport = require('../../config/passport');

router.get(
  "/google",
  passport.authenticate("google", {
    scope: ["profile", "email"],
  })
);

router.get(
  "/google/callback",
  passport.authenticate("google", {
    failureRedirect: "/login",
  }),
  (req, res) => {

    console.log(req.user);

    //res.send("Login Google completato");
    res.json(req.user);
  }
);
module.exports = router;