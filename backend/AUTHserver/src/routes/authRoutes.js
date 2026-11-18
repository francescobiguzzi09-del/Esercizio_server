const express = require('express');
const router = express.Router();
const passport = require('../../config/passport');
const config = require('../../config/env');
const { syncUserWithDatabase } = require('../services/dbUserClient');
const { generateAuthToken } = require('../utils/jwt');
router.get(
  "/google",
  passport.authenticate("google", {
    scope: ["profile", "email"],
    prompt: "select_account",
  })
);

// Google rimanda qui. Se il login riesce NON restituiamo il JSON di Google:
// la sessione contiene già l'utente, quindi riportiamo il browser sul sito.
// Sarà la navbar a chiedere /me per sapere chi è loggato.
router.get(
    '/google/callback',
    passport.authenticate('google', {
        failureRedirect: `${config.FRONTEND_URL}?error=google_auth_failed`
    }),
    async (req, res) => {
        try {
            // 1. Invia il profilo Google al Server DB per controllo/registrazione
            const dbUser = await syncUserWithDatabase(req.user);

            // 2. Salva l'ID di MongoDB anche nella sessione locale
            req.session.dbUserId = dbUser.id;

            // 3. Genera il JWT leggibile dal Server DB
            const token = generateAuthToken(dbUser);

            // 4. Salva il JWT nel cookie con le tue stesse impostazioni di sicurezza
            res.cookie('auth_token', token, {
                httpOnly: true,
                sameSite: 'lax',
                secure: config.NODE_ENV === 'production',
                maxAge: 1000 * 60 * 60 * 8 // 8 ore
            });

            // 5. Redirect al frontend
            return res.redirect(config.FRONTEND_URL);
        } catch (error) {
            console.error('Errore durante la sincronizzazione utente:', error.message);
            return res.redirect(`${config.FRONTEND_URL}?error=db_sync_failed`);
        }
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
