const { ObjectId } = require('mongodb');

// Whitelist delle collezioni accessibili dal frontend (esclude 'users')
const ALLOWED_COLLECTIONS = ['progetti', 'note', 'task', 'weather_history'];

function createHttpError(message, statusCode) {
    const error = new Error(message);
    error.statusCode = statusCode;
    return error;
}

// 1. Verifica che la collezione sia nella whitelist
function validateCollection(collectionName) {
    if (!collectionName || !ALLOWED_COLLECTIONS.includes(collectionName)) {
        throw createHttpError('Collezione non valida o non autorizzata', 400);
    }
    return collectionName;
}

// 2. Verifica che l'utente sia autenticato e abbia un ObjectId valido
function validateUser(user) {
    const userId = user?.id || user?._id;

    if (!userId) {
        throw createHttpError('Utente non autenticato', 401);
    }

    if (!ObjectId.isValid(userId)) {
        throw createHttpError('ID utente non valido', 400);
    }

    return new ObjectId(userId);
}

// 3. Verifica che il body contenga un oggetto JSON non vuoto (per il salvataggio)
function validateBody(body) {
    if (!body || typeof body !== 'object' || Array.isArray(body) || Object.keys(body).length === 0) {
        throw createHttpError('Nessun dato valido inviato nel body', 400);
    }
    return body;
}

// 4. Verifica che i filtri di ricerca siano un oggetto (può anche essere vuoto)
function validateSearchFilters(body) {
    if (!body) return {};
    if (typeof body !== 'object' || Array.isArray(body)) {
        throw createHttpError('I filtri di ricerca devono essere un oggetto JSON', 400);
    }
    return body;
}

// 5. Valida esattamente i campi prodotti dalla tua strategia Passport
function validateGoogleProfile(profile) {
    if (!profile || typeof profile !== 'object') {
        throw createHttpError('Dati utente Google mancanti o non validi', 400);
    }

    const { googleId, firstName, displayName, email, avatar } = profile;

    if (!googleId || !email) {
        throw createHttpError('Campi obbligatori mancanti (googleId o email)', 400);
    }

    return {
        googleId: String(googleId).trim(),
        email: String(email).toLowerCase().trim(),
        firstName: firstName ? String(firstName).trim() : '',
        displayName: displayName ? String(displayName).trim() : '',
        avatar: avatar ? String(avatar).trim() : null
    };
}

module.exports = {
    validateCollection,
    validateUser,
    validateBody,
    validateSearchFilters,
    validateGoogleProfile
};