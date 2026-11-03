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

    console.log(req.user);

    //res.send("Login Google completato");
    res.redirect("http://localhost:4000/api/v1/");
  }
);

router.get("/logout", (req, res) => {
  req.logout((err => (err ? nex)  
});
module.exports = router;