const { ObjectId } = require('mongodb');

function buildDocument(rawData, userObjectId) {
    // Scarta i campi che devono essere gestiti solo dal server
    const {
        _id,
        userId,
        createdAt,
        updatedAt,
        collection,
        ...cleanData
    } = rawData;

    const now = new Date();

    return {
        ...cleanData,
        userId: userObjectId,
        createdAt: now,
        updatedAt: now
    };
}

function buildSearchQuery(rawFilters, userObjectId) {
    const safeFilters = {};

    for (const [key, value] of Object.entries(rawFilters)) {
        // Ignora operatori MongoDB di primo livello (es. $where) e tentativi di sovrascrivere userId
        if (key.startsWith('$') || key === 'userId') {
            continue;
        }
        // Se il frontend cerca un documento specifico per "_id", lo converte in ObjectId
        if (key === '_id' && ObjectId.isValid(value)) {
            safeFilters._id = new ObjectId(value);
            continue;
        }
        safeFilters[key] = value;
    }

    // Forza sempre il filtro sull'utente autenticato
    return {
        ...safeFilters,
        userId: userObjectId
    };
}

module.exports = {
    buildDocument,
    buildSearchQuery
};