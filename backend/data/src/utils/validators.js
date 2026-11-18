const { ObjectId } = require('mongodb');

const ALLOWED_COLLECTIONS = ['progetti', 'note', 'task'];

function createHttpError(message, statusCode) {
    const error = new Error(message);
    error.statusCode = statusCode;
    return error;
}

// 1. Verifica che la collezione esista nella whitelist
function validateCollection(collectionName) {
    if (!collectionName || !ALLOWED_COLLECTIONS.includes(collectionName)) {
        throw createHttpError('Collezione non valida o non autorizzata', 400);
    }
    return collectionName;
}

// 2. Verifica che l'utente sia loggato e abbia un ObjectId valido
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

// 3. Verifica che il body contenga un oggetto JSON non vuoto
function validateBody(body) {
    if (!body || typeof body !== 'object' || Array.isArray(body) || Object.keys(body).length === 0) {
        throw createHttpError('Nessun dato valido inviato nel body', 400);
    }
    return body;
}

// ... funzioni precedenti (validateCollection, validateUser, validateBody) ...

// 4. Verifica che i filtri di ricerca siano un oggetto (può anche essere vuoto)
function validateSearchFilters(body) {
    if (!body) return {};
    if (typeof body !== 'object' || Array.isArray(body)) {
        throw createHttpError('I filtri di ricerca devono essere un oggetto JSON', 400);
    }
    return body;
}

module.exports = {
    validateCollection,
    validateUser,
    validateBody,
    validateSearchFilters
};