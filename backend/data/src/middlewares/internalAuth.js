const config = require('../../config/env');

function verifyInternalKey(req, res, next) {
    const apiKey = req.headers['x-internal-key'];

    if (!apiKey || apiKey !== config.internalApiKey) {
        return res.status(403).json({ error: 'Accesso negato: chiave interna non valida' });
    }

    next();
}

module.exports = { verifyInternalKey };