const jwt = require('jsonwebtoken');
const config = require('../../config/env');
function authMiddleware(req, res, next) {
    // Legge il JWT dal cookie 'auth_token' oppure dall'header Authorization
    const token =
        req.cookies?.auth_token ||
        (req.headers.authorization?.startsWith('Bearer ')
            ? req.headers.authorization.split(' ')[1]
            : null);

    if (!token) {
        return res.status(401).json({ error: 'Accesso non autorizzato: token mancante' });
    }

    try {
        const decoded = jwt.verify(token, config.jwtSecret);
        req.user = decoded; // Contiene { id, email, name }
        next();
    } catch (error) {
        return res.status(401).json({ error: 'Token non valido o scaduto' });
    }
}

module.exports = { authMiddleware };