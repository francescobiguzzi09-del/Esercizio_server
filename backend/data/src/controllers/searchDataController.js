const { connectToMongoDB, disconnectFromMongoDB } = require('../config/connection');
const { logger } = require('../config/logger');
const {
    validateCollection,
    validateUser,
    validateBody,
    validateSearchFilters
} = require('../utils/validators');
const { buildDocument, buildSearchQuery } = require('../utils/sanitize');

// ... exports.saveData già presente ...

exports.searchData = async (req, res) => {
    let client;

    try {
        // 1. Riusa gli utils per validare collezione, utente e filtri
        const collectionName = validateCollection(req.params.collection);
        const userObjectId = validateUser(req.user);
        const rawFilters = validateSearchFilters(req.body);

        // 2. Costruisce la query sicura legata all'utente
        const query = buildSearchQuery(rawFilters, userObjectId);

        // 3. Ricerca su MongoDB Atlas
        client = await connectToMongoDB();
        const db = client.db('mydatabase');
        const collection = db.collection(collectionName);

        const results = await collection.find(query).toArray();
        logger(`Found ${results.length} documents in ${collectionName}`);

        // 4. Restituisce l'array di risultati (status 200 OK)
        return res.status(200).json(results);

    } catch (error) {
        const statusCode = error.statusCode || 500;
        logger(`Error occurred while searching data: ${error.message}`);

        return res.status(statusCode).json({
            error: statusCode === 500 ? 'Errore interno del server' : error.message
        });
    } finally {
        if (client) {
            await disconnectFromMongoDB();
        }
    }
};